#!/bin/bash
set -o errexit # Exit on error
fhc app logs tail --app=$1 --env=$2