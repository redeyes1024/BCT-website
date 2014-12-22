import os.path
import re
import subprocess

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

    for path in config_dict['PATHS'].values():

        change_route_in_source(path)

def compress_all_sources():

    bash_command = "bash"

    proc = subprocess.Popen(bash_command, shell = True, stdout = subprocess.PIPE, stderr = subprocess.PIPE)

    proc.wait()

main()