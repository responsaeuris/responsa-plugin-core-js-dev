#!/bin/bash
set -e # stops on first error

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "GENERATING BUILD FINGERPRINT"

sed -i "s|CI_PUTS_HERE_LAST_GIT_COMMIT|$LAST_COMMIT|g" /_/app/routes/status/statusRoute.js
today=$(date)
sed -i "s|CI_PUTS_HERE_DEPLOY_DATE|$today|g" /_/app/routes/status/statusRoute.js

cat /_/app/routes/status/statusRoute.js

echo "" && echo "***********************************************************" && /_/build/scripts/print-step.sh "CREATING TEST ENV"

rm -f /_/app/test/.env
echo "ELASTIC_URI=${ELASTIC_URI}" > /_/app/test/.env
echo "ELASTIC_USER=${ELASTIC_USER}" >> /_/app/test/.env
echo "ELASTIC_PASSWORD=${ELASTIC_PASSWORD}" >> /_/app/test/.env
echo "ELASTIC_INDEX=${ELASTIC_INDEX}" >> /_/app/test/.env