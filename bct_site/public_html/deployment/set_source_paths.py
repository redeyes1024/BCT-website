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

if (args.config_location == None):
    config_location = "./source_path_config.txt"
else:
    config_location = args.config_location

with open(config_location) as config_file:
    config_file_cts = config_file.read()

def parse_config(sub_cts, parse_depth_counter):

  ####  result_dict = {}

    regexp = "(^|\n)" + ("#" * parse_depth_counter) + "\w+"

    labels = re.finditer(regexp, sub_cts)

    label_list = []

    label_cts_idx_list_list = []

    label_cts_idx_list = []

    label_counter = 0

    for label in labels:
        label_counter += 1
        cur_label = label.group()
        cor_label = cur_label[1:] if cur_label[0] == '\n' else cur_label
        label_list.append(cor_label)
        label_cts_idx_list.append(label.start())
        label_cts_idx_list.append(label.end())
    print("\n", parse_depth_counter, "\n", sub_cts, regexp, "\n")
    if label_counter == 0:
        return True

    for idx in range(0, len(label_cts_idx_list)):
        if (idx % 2 != 0):
            if (idx + 1 != len(label_cts_idx_list)):
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
        result_dict.update({
            label_list[list_list_count]: cur_cts
        });
        list_list_count += 1

    parse_depth_counter += 1

    for label, new_sub_cts in result_dict.items():
        parse_config(new_sub_cts, parse_depth_counter)

parse_config(config_file_cts, 1)
