# Ref.
# https://stackoverflow.com/questions/192249/how-do-i-parse-command-line-arguments-in-bash
# https://opensource.com/article/19/12/help-bash-program

#!/bin/bash

POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -e|--extension)
    EXTENSION="$2"
    shift # past argument
    shift # past value
    ;;
    -s|--searchpath)
    SEARCHPATH="$2"
    shift # past argument
    shift # past value
    ;;
    -l|--lib)
    LIBPATH="$2"
    shift # past argument
    shift # past value
    ;;
    --default)
    DEFAULT=YES
    shift # past argument
    ;;
    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

echo "FILE EXTENSION  = ${EXTENSION}"
echo "SEARCH PATH     = ${SEARCHPATH}"
echo "LIBRARY PATH    = ${LIBPATH}"
echo "DEFAULT         = ${DEFAULT}"
echo "Number files in SEARCH PATH with EXTENSION:" $(ls -1 "${SEARCHPATH}"/*."${EXTENSION}" | wc -l)
if [[ -n $1 ]]; then
    echo "Last line of file specified as non-opt/last argument:"
    tail -1 "$1"
fi

Help()
{
    # Display Help
    echo "Add description of the script functions here."
    echo
    echo "Syntax: scriptTemplate [-g|h|v|V]"
    echo "options:"
    echo "g     Print the GPL license notification."
    echo "h     Print this Help."
    echo "v     Verbose mode."
    echo "V     Print software version and exit."
    echo
}

while getopts ":h" option; do
    case $option in
        h) # display Help
            Help
            exit;;
    esac
done