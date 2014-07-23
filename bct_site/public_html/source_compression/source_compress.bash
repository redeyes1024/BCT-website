#!/bin/bash

#Copy-paste dependencies in order into a text file. Specify its filename and
#path (relative to the directory containing this script) in the third argument.
#If source list filename is supplied, it defaults to a local file named
#all_sources.txt. The user will be notified when any defaults are used.

type=$1
output_filename=$2
sourcelist=$3

if [ -z $type ] || [[ $type != "css" && $type != "js" ]]; then
    echo "Type missing or invalid. Use either 'css' or 'js'."
    exit
fi

root_dir=$HOME'/NetBeansProjects/ISR/BCT-website/bct_site/public_html/'
yuicompressor_dir=$HOME'/Documents/java_utilities'

function useDefaultFilenameIfNoneSpecified {

    if [ -z $output_filename ]; then

        filename=$1

        echo ""
        echo "Using default output filename: "$output_filename
        echo ""

    fi

}

if [ -z $sourcelist ]; then

    sourcelist="all_sources.txt"

    echo ""
    echo "Using default source list file: "$sourcelist
    echo ""

fi

case $type in

   "css")

        useDefaultFilenameIfNoneSpecified "compressed_stylesheet.css"

        sources=`cat $sourcelist | grep -Eo "href=\".*?\"" | \
        sed 's/"//g' | sed 's/href=//'`


    ;;

   "js")

        useDefaultFilenameIfNoneSpecified "compressed_javascript.js"

        sources=`cat $sourcelist | grep -Eo "src=\".*\"" | \
        grep -v "http" | sed 's/"//g' | sed 's/src=//'`

    ;;

esac

full_sources=`printf '%b\n' $sources | awk -v root_dir=$root_dir \
'{ print root_dir$0 }'`

echo ""
echo "Compressing the following sources:"
echo ""

printf '%b\n' $full_sources

cat $full_sources | java -jar $yuicompressor_dir/yuicompressor-2.4.8.jar \
--type $type --line-break 4000 > $output_filename

orig_size=`cat $full_sources | wc -c`
new_size=`cat $output_filename | wc -c`

orig_size_kb=`echo "scale=2; "$orig_size" / 1000" | bc`
new_size_kb=`echo "scale=2; "$new_size" / 1000" | bc`

comp_ratio=`echo "scale=2; 100 - (100 * "$new_size" / "$orig_size")" | bc`

echo ""

echo "Original size: "$orig_size_kb" kb."
echo "Compressed size: "$new_size_kb" kb."

echo "Compression ratio: "$comp_ratio"%."

echo ""

echo "Please don't forget to change relative URLs from the original source \
files before deployment."

echo ""