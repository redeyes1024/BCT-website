#!/bin/bash

while getopts ":c:r:" opt; do

    case ${opt} in

        r)

            new_root=${OPTARG}

            ;;

        c)

            config_filename=${OPTARG}

        ;;

        *)

            echo "Invalid or missing option: -${OPTARG}" >&2

            exit

            ;;

    esac

done

if [ -z ${new_root} ]; then

    echo "New root missing. Use either 'local', 'isr' or 'bct'." >&2

    exit

fi

if [ ${new_root} != "local" ] && \
   [ ${new_root} != "isr" ] && \
   [ ${new_root} != "bct" ]; then

    echo "New root is invalid. Use either 'local', 'isr' or 'bct'." >&2

    exit

fi

if [ -z ${config_filename} ]; then

    config_filename="./source_path_config.txt"

    echo "Using default config filename: ${config_filename}."

fi

