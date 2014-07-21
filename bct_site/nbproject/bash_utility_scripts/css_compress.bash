#!/bin/bash

root_dir='/Users/Andrew/NetBeansProjects/ISR/BCT-website/bct_site/public_html/'

dir1=$root_dir
dir2=$root_dir'bct_my_ride/css/'
dir3=$root_dir'bct_my_ride/css/ngQuickDate/'

all_dirs=($dir1 $dir2 $dir3)

compressed=""

for dir in ` seq 0 $(( ${#all_dirs[*]} - 1 )) `
do
    compressed=$compressed"\n"$`cat ${all_dirs[$dir]}*.css | java -jar yuicompressor-2.4.8.jar --type css`
done

echo $compressed > compressed_stylesheet.css
