import os
import re
import subprocess
import shlex
import time
import shutil
import distutils.core

class FolderNames:

    deployment = "deployment"
    output = ""

class PathsToConfigFile:

    default = "./myride_with_profile_setup_deploy_config.txt"
    current = default

class ConfigFileParseOutputDictionary:

    dict = {}

class UserSelectedSettings:

    web_root_name = ""

class JavaScriptFileTargetExpressions:

    start = "//START DEPLOYMENT_ROOT_TARGET"
    end = "//END DEPLOYMENT_ROOT_TARGET"

class ProfilePageTargetExpressions:

    start_compressed = "<!-- START Compressed Sources"
    start_forms = "<!-- START Sources for forms -->"
    end_forms = "<!-- END Sources for forms -->"
    stylesheets_tag = "<link"
    scripts_tag = "<script"

class AlteredProfilePageTempName:

    name = "altered_profile_page_temp.html"

def main():

    prompt_for_path_confirmation()

    with open(PathsToConfigFile.current) as config_file:

        config_file_cts = config_file.read()

    parse_config_file(config_file_cts, 1, [])

    display_config_file_settings()

    prompt_for_alt_web_root_name_selection()

    change_web_root_in_target_files()

    compress_all_sources()

    create_deployment_profile_page()

    prepare_deployment_folder()

    zip_deployment_folder()

    print("\nMyRide is ready to deploy. The output folder and associated .zip file can be found here: " +
        ConfigFileParseOutputDictionary.dict["OUTPUT_INFO"]["PATH"])

def prompt_for_path_confirmation():

    print("The configuration file path is: " + PathsToConfigFile.current + "\n\nIs this correct? Y/N")

    config_path_resp = input()

    if config_path_resp.upper() == "N":

        prompt_for_new_config_path()

    elif config_path_resp.upper() != "Y":

        print("Your entry (\"" + config_path_resp + "\") is invalid. Please enter either Y or N (case-insensitive).\n")

        prompt_for_path_confirmation()

def prompt_for_new_config_path():

    print("Please enter the new path to the configuration file: ")

    check_config_file_path(input())

def check_config_file_path(new_path_to_config):

    file_exists = os.path.isfile(new_path_to_config)

    if not file_exists:

        print("That file does not exist.")

        prompt_for_new_config_path()

    else:

        PathsToConfigFile.current = new_path_to_config

        prompt_for_path_confirmation()

def parse_config_file(sub_cts, parse_depth_counter, parent_prop_list):

    sub_result_dict = {}

    regexp = "(^|\n|\s{4})" + ("#" * parse_depth_counter) + "\w+"

    labels = re.finditer(regexp, sub_cts)

    label_list = []

    label_cts_idx_list_list = []

    label_cts_idx_list = []

    label_counter = 0

    for label in labels:

        label_counter += 1

        cur_label = label.group()

        cor_label = re.sub("[\n|#| ]", "", cur_label)

        label_list.append(cor_label)

        label_cts_idx_list.append(label.start())

        label_cts_idx_list.append(label.end())

    if label_counter == 0:

        parent_dict = ConfigFileParseOutputDictionary.dict

        for parent_prop in parent_prop_list[:-1]:

            cur_prop = parent_dict[parent_prop]

            parent_dict = cur_prop

        target_parent_prop = parent_prop_list[-1]

        sub_cts_cor = re.sub("[\n|#| ]", "", sub_cts)

        parent_dict[target_parent_prop] = sub_cts_cor

        return True

    for idx in range(0, len(label_cts_idx_list)):

        if idx % 2 != 0:

            if idx + 1 != len(label_cts_idx_list):

                cur_idx_list = [
                    label_cts_idx_list[idx],
                    label_cts_idx_list[idx + 1]
                ]

            else:

                cur_idx_list = [
                    label_cts_idx_list[idx],
                    len(sub_cts)
                ]

            label_cts_idx_list_list.append(cur_idx_list)

    list_list_count = 0

    for list_list in label_cts_idx_list_list:

        cur_cts = sub_cts[list_list[0]:list_list[1]]

        sub_result_dict.update({ label_list[list_list_count]: cur_cts })

        list_list_count += 1

    parse_depth_counter += 1

    if len(parent_prop_list) == 0:

        ConfigFileParseOutputDictionary.dict = sub_result_dict

    else:

        parent_dict = ConfigFileParseOutputDictionary.dict

        for parent_prop in parent_prop_list[:len(parent_prop_list)-1]:

            cur_prop = parent_dict[parent_prop]

            parent_dict = cur_prop

        target_parent_prop = parent_prop_list[len(parent_prop_list)-1]

        parent_dict[target_parent_prop] = sub_result_dict

    for label, new_sub_cts in sub_result_dict.items():

        next_parent_prop_list = parent_prop_list[:]

        next_parent_prop_list.append(label)

        parse_config_file(new_sub_cts, parse_depth_counter, next_parent_prop_list)

def check_config_file_result_dictionary():

    config_dict = ConfigFileParseOutputDictionary.dict

    error_message = ""

    if "OUTPUT_INFO" not in config_dict:

        error_message = "No output information is defined in the configuration file. Please add a path and an " + \
            "output folder base name under (i.e., minus the date) the #OUTPUT_INFO header, each prefixed " + \
            "with two hash marks (##)."

    elif "SOURCES_ROOT" not in config_dict:

        error_message = "No sources root is defined in the configuration file. Please add a path under the " + \
            "#SOURCES_ROOT header."

    elif "PATHS" not in config_dict:

        error_message = "No target paths are defined in the configuration file. Please add one or more paths " + \
            "under the #PATHS header, each prefixed with two hash marks (##)."

    elif "WEB_ROOTS" not in config_dict:

        error_message = "No alternate web root names are defined in the configuration file. Please add one " + \
            "or more paths under the #WEB_ROOTS header, each prefixed with two hash marks (##)."

    elif "SOURCES_LIST_FILE" not in config_dict:

        error_message = "No sources list file path specified. Please add a path under the #SOURCES_LIST_FILE header."

    elif "MINIFY_SETTINGS" not in config_dict:

        error_message = "No minification settings are defined in the configuration file. Please add one or " + \
            "more types under the #MINIFY_SETTINGS header, each prefixed with two hash marks (##)."

    elif "MINIFIED_SOURCE_OUTPUT_NAMES" not in config_dict:

        error_message = "No minified sources output filenames are defined in the configuration file. Please add " + \
            "one or more types under the #MINIFIED_SOURCE_OUTPUT_NAMES header, each prefixed with two hash marks (##)."

    elif "PROFILE_PAGE_PATH" not in config_dict:

        error_message = "No profile page path is defined in the configuration file. Please add a path under the " + \
            "#PROFILE_PAGE_PATH header."

    elif "OTHER_SOURCES_PATHS" not in config_dict:

        error_message = "No paths to other sources are defined in the configuration file. Please add one or more " + \
            "path labels, under the #OTHER_SOURCES_PATHS header, prefixed by two hash marks (##). Then for each " + \
            "of these, supply both a path (or write MAIN for the output folder root), and a comma-separated list " + \
            "of files for each path that are necessary for deployment (or ALL for all files and sub-directories " + \
            "in the path), each prefixed by three hash marks (###)"

    return error_message

def create_list_string_from_dict(input_dict):

    list_string = ""

    item_counter = 0

    for key, value in input_dict.items():

        item_counter += 1

        if type(value) is dict:

            value = create_list_string_from_dict(value)

        list_string += key + ": " + value

        if item_counter < len(input_dict):

            list_string += ", "

    return list_string

def prompt_for_settings_check():

    print("Are these settings correct? Y/N")

    settings_check_resp = input()

    if settings_check_resp.upper() == "N":

        exit("Please alter the configuration file, found under this path: " + PathsToConfigFile.current)

    elif settings_check_resp.upper() != "Y":

        print(
            "Your entry (\"" + settings_check_resp + "\") is invalid. Please enter either Y or N (case-insensitive).\n"
        )

        prompt_for_settings_check()

def display_config_file_settings():

    error_message = check_config_file_result_dictionary()

    if error_message != "":

        exit(error_message)

    print("\nThe following are your configuration settings:")

    config_dict = ConfigFileParseOutputDictionary.dict

    output_information = create_list_string_from_dict(config_dict["OUTPUT_INFO"])

    sources_root = config_dict["SOURCES_ROOT"]

    path_list = create_list_string_from_dict(config_dict["PATHS"])

    web_roots_list = create_list_string_from_dict(config_dict["WEB_ROOTS"])

    sources_list_file_path = config_dict["SOURCES_LIST_FILE"]

    minified_source_output_names = create_list_string_from_dict(config_dict["MINIFIED_SOURCE_OUTPUT_NAMES"])

    minification_settings = create_list_string_from_dict(config_dict["MINIFY_SETTINGS"])

    profile_page_path = config_dict["PROFILE_PAGE_PATH"]

    other_sources_paths = create_list_string_from_dict(config_dict["OTHER_SOURCES_PATHS"])

    print(
        """
        Output Information: {0}\n
        Sources Root: {1}\n
        Target File Paths: {2}\n
        Alternate Web Roots: {3}\n
        Minified Source Output Names: {4}\n
        Sources List File Path: {5}\n
        Minification Settings: {6}\n
        Path to Profile Page: {7}\n
        Paths to Other Sources: {8}
        """.format(
            output_information,  # {0}
            sources_root,  # {1}
            path_list,  # {2}
            web_roots_list,  # {3}
            minified_source_output_names,  # {4}
            sources_list_file_path,  # {5}
            minification_settings,  # {6}
            profile_page_path,  # {7}
            other_sources_paths  # {8}
        )
    )

    prompt_for_settings_check()

def prompt_for_alt_web_root_name_selection():

    config_dict = ConfigFileParseOutputDictionary.dict

    print("\nWhich web root would you like to use? (see list above, case-insensitive)")

    new_web_root_name_selection = input().upper()

    if new_web_root_name_selection.upper() not in config_dict['WEB_ROOTS']:

        print("The web root name (\"" + new_web_root_name_selection + "\") cannot be found.")

        prompt_for_alt_web_root_name_selection()

    else:

        UserSelectedSettings.web_root_name = new_web_root_name_selection

def re_iter_to_list(re_iter):

    match_list = []

    for re_match in re_iter:

        match_list.append(re_match)

    return match_list

def change_route_in_source(path):

    config_dict = ConfigFileParseOutputDictionary.dict

    target_file_path = config_dict["SOURCES_ROOT"] + path

    new_root_target_location = config_dict["WEB_ROOTS"][UserSelectedSettings.web_root_name]

    with open(target_file_path, "r+") as target_file:

        target_file_cts = target_file.read()

        start_idx = re.finditer(r""+JavaScriptFileTargetExpressions.start, target_file_cts)

        end_idx = re.finditer(r""+JavaScriptFileTargetExpressions.end, target_file_cts)

        start_idx_list = re_iter_to_list(start_idx)
        end_idx_list = re_iter_to_list(end_idx)

        for i in range(len(start_idx_list)):

            start_start_idx = start_idx_list[i].start()
            start_end_idx = start_idx_list[i].end()
            end_start_idx = end_idx_list[i].start()
            end_end_idx = end_idx_list[i].end()

            target_file_cts_list = list(target_file_cts)

            target_code = target_file_cts[start_end_idx:end_start_idx]

            new_code = re.sub("site_roots\.\w+", ("site_roots." + new_root_target_location), target_code)

            target_file_cts_list[start_end_idx:end_start_idx] = list(new_code)

            target_file.seek(0)
            target_file.truncate()
            target_file.write("".join(target_file_cts_list))

def change_web_root_in_target_files():

    config_dict = ConfigFileParseOutputDictionary.dict

    for path in config_dict["PATHS"].values():

        change_route_in_source(path)

def run_shell_command(cmd, cmd_args_dict_list):

    extra_space = " "

    full_cmd_sanitized = cmd + extra_space

    for cmd_arg_dict in cmd_args_dict_list:

        extra_space = "" if cmd_arg_dict["prefix"] == "" else " "
        argument_prefix = "" if cmd_arg_dict["prefix"] == "" else shlex.quote(cmd_arg_dict["prefix"])

        full_cmd_sanitized += argument_prefix + extra_space + shlex.quote(cmd_arg_dict["argument"]) + " "

    cur_subprocess = subprocess.Popen(full_cmd_sanitized, shell=True)

    cur_subprocess.wait()

    stdout_output, stderr_output = cur_subprocess.communicate()

    return (stdout_output, stderr_output)

def get_source_list(source_type):

    source_list_path = ConfigFileParseOutputDictionary.dict["SOURCES_LIST_FILE"]

    with open(source_list_path) as source_list_file:

        source_list_file_cts = source_list_file.read()

    source_matches = []

    if source_type == "css":

        source_matches = re.findall('href=\".*?\"', source_list_file_cts)

        for i in range(0, len(source_matches)):

            source_matches[i] = re.sub("\"|(href=)", "", source_matches[i])

    elif source_type == "js":

        source_matches = re.findall('src=\".*\"', source_list_file_cts)

        source_matches = [m for m in source_matches if "http" not in m]

        for i in range(0, len(source_matches)):

            source_matches[i] = re.sub("\"|(src=)", "", source_matches[i])

    return source_matches

def concatenate_source_file_list_onto_temp_file(source_list_name, source_list, deployment_folder_name):

    source_file_parent_path = ConfigFileParseOutputDictionary.dict["SOURCES_ROOT"]

    temp_concat_file_path = source_file_parent_path + deployment_folder_name + "/" + \
        "myride_with_profile_setup_deploy_concatenated_sources_temp." + source_list_name

    temp_concat_file = open(temp_concat_file_path, "w")

    for source_file_path in source_list:

        full_source_path = source_file_parent_path + source_file_path

        with open(full_source_path, "r") as cur_source_file:

            cur_source_file_cts = cur_source_file.read()

            temp_concat_file.write(cur_source_file_cts)

            temp_concat_file.write("\n")

    temp_concat_file.close()

    return temp_concat_file_path

def compress_all_sources():

    """The js and css minification software used here is "minify" from npm. Choosing different minification software
    will necessitate changes to this function.
    """

    deployment_folder_name = FolderNames.deployment

    config_dict = ConfigFileParseOutputDictionary.dict

    make_folder_if_needed(config_dict["SOURCES_ROOT"] + deployment_folder_name)

    source_list_dict = {"css": get_source_list("css"), "js": get_source_list("js")}

    for source_list_name, source_list in source_list_dict.items():

        compressed_sources_file_output_name = config_dict["MINIFIED_SOURCE_OUTPUT_NAMES"][source_list_name.upper()]

        compressed_sources_file_output_absolute_path = config_dict["SOURCES_ROOT"] + deployment_folder_name + "/" + \
            compressed_sources_file_output_name

        temp_concat_file_path = concatenate_source_file_list_onto_temp_file(
            source_list_name, source_list, deployment_folder_name
        )

        minify_this_type = config_dict["MINIFY_SETTINGS"][source_list_name.upper()]

        if minify_this_type == "true":

            minify_args = [
                {"prefix": "", "argument": temp_concat_file_path},
                {"prefix": "-o", "argument": compressed_sources_file_output_absolute_path}
            ]

            print("\nMinifying ." + source_list_name + " files...")

            run_shell_command("minify", minify_args)

            os.remove(temp_concat_file_path)

        elif minify_this_type == "false":

            print("\nSkipping minify step for ." + source_list_name + " files.")

            concat_only_args = [
                {"prefix": "", "argument": temp_concat_file_path},
                {"prefix": "", "argument": compressed_sources_file_output_absolute_path}
            ]

            run_shell_command("mv", concat_only_args)

        else:

            exit("Unexpected minifier configuration: " + minify_this_type + ".\nPlease use either \"true\" or " +
                 "\"false\" for the items under the #MINIFIED_SOURCE_OUTPUT_NAMES header")

def make_folder_if_needed(path):

    if not os.path.exists(path):

        os.makedirs(path)

    if not os.path.exists(path):

        exit("There was an error creating this output folder: " + path)

def create_output_folder():

    config_dict = ConfigFileParseOutputDictionary.dict

    folder_name_base = config_dict["OUTPUT_INFO"]["FOLDER_NAME_BASE"]

    date_str = time.strftime("%y_%m_%d")

    output_folder_name = FolderNames.output = folder_name_base + "_" + date_str

    output_dir = config_dict["OUTPUT_INFO"]["PATH"]

    output_dir_with_new_folder = output_dir + output_folder_name + "/"

    make_folder_if_needed(output_dir_with_new_folder)

    return output_dir_with_new_folder

def update_source_files(full_output_path):

    print("\nUpdating source files in: " + full_output_path)

    config_dict = ConfigFileParseOutputDictionary.dict

    for path_info in config_dict["OTHER_SOURCES_PATHS"].values():

        cur_path = path_info["PATH"]

        if cur_path == "MAIN":

            cur_path = ""

        cur_files = path_info["FILES"].split(",")

        source_path_base = config_dict["SOURCES_ROOT"] + cur_path

        dest_path_base = full_output_path + cur_path

        make_folder_if_needed(dest_path_base)

        cur_sub_dirs = []

        if cur_files[0] == "ALL":

            cur_files = os.listdir(source_path_base)

        for file_name in (cur_files + cur_sub_dirs):

            source_path = source_path_base + file_name

            dest_path = dest_path_base + file_name

            try:

                shutil.copyfile(source_path, dest_path)

            except IsADirectoryError:

                distutils.dir_util.copy_tree(source_path, dest_path)

    full_path_to_deployment_folder = config_dict["SOURCES_ROOT"] + FolderNames.deployment + "/"

    for compressed_file_name in config_dict["MINIFIED_SOURCE_OUTPUT_NAMES"].values():

        full_path_to_compressed_file = full_path_to_deployment_folder + compressed_file_name

        main_output_directory_with_filename = full_output_path + compressed_file_name

        shutil.copyfile(full_path_to_compressed_file, main_output_directory_with_filename)

    full_path_to_altered_profile_page = config_dict["SOURCES_ROOT"] + AlteredProfilePageTempName.name

    full_path_to_output_profile_page = full_output_path + config_dict["PROFILE_PAGE_PATH"]

    move_and_rename_profile_page_args = [
        {"prefix": "", "argument": full_path_to_altered_profile_page},
        {"prefix": "", "argument": full_path_to_output_profile_page}
    ]

    run_shell_command("mv", move_and_rename_profile_page_args)

    print("Done.")

def prepare_deployment_folder():

    full_output_path = create_output_folder()

    update_source_files(full_output_path)

def zip_deployment_folder():

    print("\nZipping output folder...")

    config_dict = ConfigFileParseOutputDictionary.dict

    source_folder = FolderNames.output

    dest_zip_file = source_folder + ".zip"

    output_directory = config_dict["OUTPUT_INFO"]["PATH"]

    old_directory = os.getcwd()

    os.chdir(output_directory)

    zip_folder_args = [
        {"prefix": "-qr", "argument": dest_zip_file},
        {"prefix": "", "argument": source_folder}
    ]

    run_shell_command("zip", zip_folder_args)

    os.chdir(old_directory)

    print("Done.")

def create_deployment_profile_page():

    print("\nAltering profile page HTML to point to compressed sources...")

    config_dict = ConfigFileParseOutputDictionary.dict

    sources_root = config_dict["SOURCES_ROOT"]

    new_scripts_path = config_dict["MINIFIED_SOURCE_OUTPUT_NAMES"]["JS"]
    new_stylesheets_path = config_dict["MINIFIED_SOURCE_OUTPUT_NAMES"]["CSS"]

    path_to_profile_page = sources_root + config_dict["PROFILE_PAGE_PATH"]

    with open(path_to_profile_page, "r") as profile_page_file:

        with open(sources_root + AlteredProfilePageTempName.name, "w") as profile_page_working_file:

            stop_checking_for_start_compressed_line = False

            stop_checking_for_forms_lines = False

            line_is_beyond_start_forms_line = False

            start_looking_for_stylesheets_path = False
            start_looking_for_scripts_path = False

            stop_looking_for_stylesheets_path = False
            stop_looking_for_scripts_path = False

            stop_looking_for_paths = False

            for line in profile_page_file:

                if not stop_looking_for_paths and stop_checking_for_start_compressed_line:

                    if start_looking_for_stylesheets_path or ".css" in line:

                        if (len(re.findall("href=\".*\.css\"", line)) != 0):

                            line = re.sub("href=\".*\.css", "href=\"" + new_stylesheets_path, line)

                            stop_looking_for_stylesheets_path = True

                    if start_looking_for_scripts_path or ".js" in line:

                        if (len(re.findall("src=\".*\.js\"", line)) != 0):

                            line = re.sub("src=\".*\.js", "src=\"" + new_scripts_path, line)

                            stop_looking_for_scripts_path = True

                    stop_looking_for_paths = (stop_looking_for_stylesheets_path + stop_looking_for_scripts_path) == 2

                    if not stop_looking_for_paths:

                        profile_page_working_file.write(line)

                if (stop_checking_for_start_compressed_line or
                    ProfilePageTargetExpressions.start_compressed not in line):

                    if (ProfilePageTargetExpressions.stylesheets_tag in line):

                        start_looking_for_stylesheets_path = True

                    if (stop_checking_for_forms_lines or not
                       (ProfilePageTargetExpressions.start_forms in line or
                        line_is_beyond_start_forms_line)):

                            if (stop_looking_for_paths or not stop_checking_for_start_compressed_line):

                                profile_page_working_file.write(line)

                    else:

                        if ProfilePageTargetExpressions.end_forms in line:

                            stop_checking_for_forms_lines = True

                        line_is_beyond_start_forms_line = True


                else:

                    profile_page_working_file.write(line[:-1] + " -->\n")

                    stop_checking_for_start_compressed_line = True

    print("Done.")

main()