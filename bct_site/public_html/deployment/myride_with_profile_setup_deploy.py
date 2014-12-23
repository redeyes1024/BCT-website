import os.path
import re
import subprocess
import shlex

class pathsToConfigFile:

    default = "./myride_with_profile_setup_deploy_config.txt"
    current = default

class configFileParseOutputDictionary:

    dict = {}

class userSelectedSettings:

    web_root_name = ""

def main():

    prompt_for_path_confirmation()

    with open(pathsToConfigFile.current) as config_file:

        config_file_cts = config_file.read()

    parse_config_file(config_file_cts, 1, [])

    display_config_file_settings()

    prompt_for_alt_web_root_name_selection()

    change_web_root_in_target_files()

    compress_all_sources()

def prompt_for_path_confirmation():

    print("The configuration file path is: " + pathsToConfigFile.current + "\n\nIs this correct? Y/N")

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

        pathsToConfigFile.current = new_path_to_config

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

        parent_dict = configFileParseOutputDictionary.dict

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

        configFileParseOutputDictionary.dict = sub_result_dict

    else:

        parent_dict = configFileParseOutputDictionary.dict

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

    config_dict = configFileParseOutputDictionary.dict

    error_message = ""

    if "SOURCES_ROOT" not in config_dict:

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

    return error_message

def create_list_string_from_dict(input_dict):

    list_string = ""

    item_counter = 0

    for key, value in input_dict.items():

        item_counter += 1

        list_string += key + ": " + value

        if item_counter < len(input_dict):

            list_string += ", "

    return list_string

def prompt_for_settings_check():

    print("Are these settings correct? Y/N")

    settings_check_resp = input()

    if settings_check_resp.upper() == "N":

        exit("Please alter the configuration file, found under this path: " + pathsToConfigFile.current)

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

    config_dict = configFileParseOutputDictionary.dict

    sources_root = config_dict["SOURCES_ROOT"]

    path_list = create_list_string_from_dict(config_dict["PATHS"])

    web_roots_list = create_list_string_from_dict(config_dict["WEB_ROOTS"])

    sources_list_file_path = config_dict["SOURCES_LIST_FILE"]

    minification_settings = create_list_string_from_dict(config_dict["MINIFY_SETTINGS"])

    print(
        """
        Sources Root: {0}\n
        Target File Paths: {1}\n
        Alternate Web Roots: {2}\n
        Sources List File Path: {3}\n
        Minification Settings: {4}
        """.format(
            sources_root,
            path_list,
            web_roots_list,
            sources_list_file_path,
            minification_settings
        )
    )

    prompt_for_settings_check()

def prompt_for_alt_web_root_name_selection():

    config_dict = configFileParseOutputDictionary.dict

    print("\nWhich web root would you like to use? (see list above, case-insensitive)")

    new_web_root_name_selection = input().upper()

    if new_web_root_name_selection.upper() not in config_dict['WEB_ROOTS']:

        print("The web root name (\"" + new_web_root_name_selection + "\") cannot be found.")

        prompt_for_alt_web_root_name_selection()

    else:

        userSelectedSettings.web_root_name = new_web_root_name_selection

def re_iter_to_list(re_iter):

    match_list = []

    for re_match in re_iter:

        match_list.append(re_match)

    return match_list

def change_route_in_source(path):

    config_dict = configFileParseOutputDictionary.dict

    target_file_path = config_dict["SOURCES_ROOT"] + path

    new_root_target_location = config_dict["WEB_ROOTS"][userSelectedSettings.web_root_name]

    with open(target_file_path, "r+") as target_file:

        target_file_cts = target_file.read()

        start_idx = re.finditer(r"//START DEPLOYMENT_ROOT_TARGET", target_file_cts)

        end_idx = re.finditer(r"//END DEPLOYMENT_ROOT_TARGET", target_file_cts)

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

    config_dict = configFileParseOutputDictionary.dict

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

    source_list_path = configFileParseOutputDictionary.dict["SOURCES_LIST_FILE"]

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

def concatenate_source_file_list_onto_temp_file(source_list_name, source_list):

    temp_concat_file_name = "myride_with_profile_setup_deploy_concatenated_sources_temp." + source_list_name

    source_file_parent_path = configFileParseOutputDictionary.dict["SOURCES_ROOT"]

    temp_concat_file = open(temp_concat_file_name, "w")

    for source_file_path in source_list:

        full_source_path = source_file_parent_path + source_file_path

        with open(full_source_path, "r") as cur_source_file:

            cur_source_file_cts = cur_source_file.read()

            temp_concat_file.write(cur_source_file_cts)

            temp_concat_file.write("\n")

    temp_concat_file.close()

    return temp_concat_file_name

def compress_all_sources():

    '''
        The js and css minification software used here is "minify" from npm.
        Choosing different minification software will necessitate a rewrite of this function.
    '''

    config_dict = configFileParseOutputDictionary.dict

    source_list_dict = {"css": get_source_list("css"), "js": get_source_list("js")}

    for source_list_name, source_list in source_list_dict.items():

        minify_this_type = config_dict["MINIFY_SETTINGS"][source_list_name.upper()]

        compressed_sources_file_output_name = config_dict["MINIFIED_SOURCE_OUTPUT_NAMES"][source_list_name.upper()]

        temp_concat_file_name = concatenate_source_file_list_onto_temp_file(source_list_name, source_list)

        if minify_this_type == "true":

            minify_args = [
                {"prefix": "", "argument": temp_concat_file_name},
                {"prefix": "-o", "argument": compressed_sources_file_output_name}
            ]

            print("\nMinifying ." + source_list_name + " files...")

            run_shell_command("minify", minify_args)

            os.remove(temp_concat_file_name)

        elif minify_this_type == "false":

            print("\nSkipping minify step for ." + source_list_name + " files.")

            concat_only_args = [
                {"prefix": "", "argument": temp_concat_file_name},
                {"prefix": "", "argument": compressed_sources_file_output_name}
            ]

            run_shell_command("mv", concat_only_args)

        else:

            exit("Unexpected minifier configuration: " + minify_this_type + ".\nPlease use either \"true\" or " +
                 "\"false\" for the items under the #MINIFIED_SOURCE_OUTPUT_NAMES header")

main()