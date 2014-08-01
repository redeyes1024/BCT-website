#!/bin/bash
#
# This script compresses either CSS or JS files when given an ordered list
# of <script> or <link rel="stylesheet"> tags. The sources are concatenated
# and then minified/optimized with YUI Compressor.
#
# Instructions:
#
# Copy-paste dependencies in order into a text file. Specify its filename and
# path (relative to the directory containing this script) with the option -s.
# If source list filename is supplied, it defaults to a local file named
# all_sources.txt. The user will be notified when any defaults are used.

while getopts ":t:f:s:" opt; do

    case ${opt} in

        t)

            type=${OPTARG}

            ;;

        f)

            output_filename=${OPTARG}

            ;;

        s)

            sourcelist=${OPTARG}

            ;;

        *)

            echo "Invalid or missing option: -${OPTARG}" >&2

            exit

            ;;

    esac

done

if [ -z ${type} ] || [[ ${type} != "css" && ${type} != "js" ]]; then
    echo "Type missing or invalid. Use either '-t css' or '-t js'." >&2
    exit
fi

readonly ROOT_DIR=$(
    printf "%s/NetBeansProjects/ISR/BCT-website/bct_site/public_html/" "${HOME}"
)
readonly YUICOMPRESSOR_DIR=$(
    printf "%s/Documents/java_utilities" "${HOME}"
)

function useDefaultFilenameIfNoneSpecified {

    if [ -z ${output_filename} ]; then

        default_output_filename=${1}

        output_filename=${default_output_filename}

        printf "\nUsing default output filename: %s\n" \
               "${default_output_filename}"

    fi

}

if [ -z $sourcelist ]; then

    sourcelist="all_sources.txt"

    printf "\nUsing default source list file: %s\n" \
           "${sourcelist}"

fi

case $type in

   "css")

        useDefaultFilenameIfNoneSpecified "compressed_stylesheet.css"

        sources=$(
            cat ${sourcelist} |
            grep -Eo "href=\".*?\"" |
            sed 's/"//g' |
            sed 's/href=//'
        )

        ;;

   "js")

        useDefaultFilenameIfNoneSpecified "compressed_javascript.js"

        sources=$(
            cat ${sourcelist} |
            grep -Eo "src=\".*\"" |
            grep -v "http" |
            sed 's/"//g' |
            sed 's/src=//'
        )

        ;;

esac

full_sources=$(
    printf '%b\n' "${sources}" |
    awk -v root_dir="${ROOT_DIR}" '{ print root_dir $0 }'
)

printf "\nCompressing the following sources: \n\n%b\n" "${full_sources}"

# YUI Compressor breaking CSS, especially calc() values (bug already reported)
# TODO: Find new CSS compression engine
# In the meanwhile, just concatenate the CSS

if [[ "${type}" == "css" ]]; then

    gawk 'FNR==1 {print ""}1' ${full_sources} > ${output_filename}

elif [[ "${type}" == "js" ]]; then

    gawk 'FNR==1 {print ""}1' ${full_sources} |
    java -jar "${YUICOMPRESSOR_DIR}/yuicompressor-2.4.8.jar" --type ${type} \
    --line-break 4000 --nomunge > ${output_filename}

fi

orig_size=$(cat $full_sources | wc -c)
new_size=$(cat $output_filename | wc -c)

orig_size_kb=$(echo "scale=2; ${orig_size} / 1000" | bc)
new_size_kb=$(echo "scale=2; ${new_size} / 1000" | bc)

comp_ratio=$(echo "scale=2; 100 - (100 * ${new_size} / ${orig_size})" | bc)

printf "\nOriginal size: %2.2f kb" "${orig_size_kb}"
printf "\nCompressed size: %2.2f kb" "${new_size_kb}"
printf "\nCompression ratio: %2.2f%%\n" "${comp_ratio}"

printf "\n%s\n\n" "Please don't forget to change relative URLs from the \
original source files before deployment."