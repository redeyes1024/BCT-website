#!/bin/bash

while getopts ":t:f:s:m:" opt; do

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

if [ -z ${new_root} ] ||
    [[ ${new_root} != "local" && ${new_root} != "isr" && ${new_root} != "bct"]];
    then

        echo "Type missing or invalid. Use either 'local', 'isr' or 'bct'." >&2

    exit

fi

readonly ROOT_DIR=$(
    printf "%s/NetBeansProjects/ISR/BCT-website/bct_site/public_html/" "${HOME}"
)

function useDefaultConfigFilenameIfNoneSpecified {

    if [ -z ${output_filename} ]; then

        config_filename=${1}

        printf "\nUsing default output filename: %s\n" \
               "${default_output_filename}"

    fi

}

if [ -z ${sourcelist} ]; then

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

        all_js_sources=$(
            cat ${sourcelist} |
            grep -Eo "src=\".*\"" |
            grep -v "http" |
            sed 's/"//g' |
            sed 's/src=//'
        )

        pre_minified_js_sources=$(
            printf '%b\n' ${all_js_sources} |
            grep ".min."
        )

        if [[ "${compression_mode}" != "concat" ]]; then

            sources=$(
                printf '%b\n' ${all_js_sources} |
                grep -v ".min."
            )

        else

            sources=${all_js_sources}

        fi

        ;;

esac

full_sources=$(
    printf '%b\n' "${sources}" |
    awk -v root_dir="${ROOT_DIR}" '{ print root_dir $0 }'
)

printf "\nCompressing the following sources: \n\n%b\n" "${full_sources}"

gawk 'FNR==1 {print ""}1' ${full_sources} > ${output_filename}

if [[ -z ${compression_mode} ]]; then

    echo ""

    min_output_filename=$(echo ${output_filename} | sed 's/\./.min./')

    minify ${output_filename} -o ${min_output_filename}

    rm ./${output_filename}

    output_filename=${min_output_filename}

    if [[ "${type}" == "js" ]]; then

        full_pre_minified_js_sources=$(
            printf '%b\n' "${pre_minified_js_sources}" |
            awk -v root_dir="${ROOT_DIR}" '{ print root_dir $0 }'
        )

        full_pre_minified_js_sources="${full_pre_minified_js_sources} \
        ${output_filename}"

        gawk 'FNR==1 {print ""}1' ${full_pre_minified_js_sources} > \
        temp_full_compressed_js_sources.min.js

        rm ./${output_filename}

        mv temp_full_compressed_js_sources.min.js ${output_filename}

    fi

fi

if [[ "${type}" == "js" && "${compression_mode}" != "concat" ]]; then

    orig_size=$(cat ${full_pre_minified_js_sources} | wc -c)

else

    orig_size=$(cat ${full_sources} | wc -c)

fi

new_size=$(cat $output_filename | wc -c)

orig_size_kb=$(echo "scale=2; ${orig_size} / 1000" | bc)
new_size_kb=$(echo "scale=2; ${new_size} / 1000" | bc)

comp_ratio=$(echo "scale=2; 100 - (100 * ${new_size} / ${orig_size})" | bc)

printf "\nOriginal size: %2.2f kb" "${orig_size_kb}"
printf "\nCompressed size: %2.2f kb" "${new_size_kb}"
printf "\nCompression ratio: %2.2f%%\n" "${comp_ratio}"

printf "\n%s\n\n" "Please don't forget to change relative URLs from the \
original source files before deployment."