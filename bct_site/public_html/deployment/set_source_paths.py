import argparse
import re

parser = argparse.ArgumentParser()

parser.add_argument(
    "-n", "--new_root", help="Sets the name of the new server root to sources."
)

parser.add_argument(
    "-c", "--config_location", help="Sets the path of the configuration file."
)

args = parser.parse_args()

if args.config_location == None:
    config_location = "./source_path_config.txt"
else:
    config_location = args.config_location

with open(config_location) as config_file:
    config_file_cts = config_file.read()       

def parse_config(sub_cts, parse_depth_counter, parent_prop_list):

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
        parent_dict = result_dict
        for parent_prop in parent_prop_list[:len(parent_prop_list)-1]:
            cur_prop = parent_dict[parent_prop]
            parent_dict = cur_prop

        target_parent_prop = parent_prop_list[len(parent_prop_list)-1]
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
        global result_dict
        result_dict = sub_result_dict
    else:
        parent_dict = result_dict
        for parent_prop in parent_prop_list[:len(parent_prop_list)-1]:
            cur_prop = parent_dict[parent_prop]
            parent_dict = cur_prop

        target_parent_prop = parent_prop_list[len(parent_prop_list)-1]
        parent_dict[target_parent_prop] = sub_result_dict

    for label, new_sub_cts in sub_result_dict.items():
        next_parent_prop_list = parent_prop_list[:]
        next_parent_prop_list.append(label)
        parse_config(new_sub_cts, parse_depth_counter, next_parent_prop_list)

parse_config(config_file_cts, 1, [])

new_root_target_location = ""

valid_root_names = ""
root_name_ctr = 0
for new_root_name in result_dict['WEB_ROOTS'].keys():
    valid_root_names += new_root_name
    if (root_name_ctr != len(result_dict['WEB_ROOTS']) - 1):
        valid_root_names += ", "
    root_name_ctr += 1

if args.new_root == None:
    exit("Please supply a new root name.\nValid root names:\n" + valid_root_names)
else:
    for new_root_name, new_root_location in result_dict['WEB_ROOTS'].items():
        if args.new_root == new_root_name:
            new_root_target_location = new_root_location
            break

    if new_root_target_location == "":
        exit("Unrecognized target root name: " + args.new_root + ".\nValid root names:\n" + valid_root_names)

def re_iter_to_list(re_iter):
    match_list = []
    for re_match in re_iter:
        match_list.append(re_match)
    return match_list

def change_route_in_source(path):
    target_file_path = result_dict['SOURCES_ROOT'] + path

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

for path in result_dict['PATHS'].values():
    change_route_in_source(path)