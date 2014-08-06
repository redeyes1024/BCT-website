#!/bin/bash

#This script is experimental and not yet functional
#May not be needed for immediate releases

cat compressed_stylesheet.css |
    gawk  '/^.*[{|,]$/ && !/@media/ { print $0 }' |
    gawk 'BEGIN { RS=" "; ORS=" " } !/^$/ { print "#bct-app " $0 }' |
    sed 's/#bct-app {/{/' |
    sed 's/^/#bct-app /'