#!/bin/bash

echo "Please check if you have installed NodeJS. It's required when building."
echo "This anticheat project is under AGPL 3.0 license. Please follow it."
echo "Github link: https://github.com/jasonlaubb/Matrix-AntiCheat"

read -p "Would you like to continue? (Y/N): " user_input
if [[ ! "$user_input" =~ ^[Yy]$ ]]; then
    echo "Process ended."
    read -p "Press any key to continue..." -n1 -s
    exit 1
fi

# Install the node modules
npm install
npm install --prefix ./ac_BP/src

if [ -d "./ac_BP/src/node_modules/matrix-anticheat" ]; then
    rm -rf "./ac_BP/src/node_modules/matrix-anticheat"
fi

# Build the javascript
mkdir -p "./ac_BP/scripts"
cp -r "./ac_BP/src/node_modules" "./ac_BP/scripts/node_modules"
tsc --build ./tsconfig.json

# Build the language
node ./ac_RP/texts/generator.js

# Create the right folder for generate
mkdir -p "./generated-package/Matrix-anti_BP"
mkdir -p "./generated-package/Matrix-anti_RP"

# Copy the behavior pack
cp "./ac_BP/pack_icon.png" "./generated-package/Matrix-anti_BP/"
cp "./ac_BP/bug_pack_icon.png" "./generated-package/Matrix-anti_BP/"
cp "./ac_BP/manifest.json" "./generated-package/Matrix-anti_BP/"
cp "./LICENSE" "./generated-package/Matrix-anti_BP/"
mkdir -p "./generated-package/Matrix-anti_BP/texts"
cp "./ac_BP/texts/"*.lang "./generated-package/Matrix-anti_BP/texts/"
cp "./ac_BP/texts/languages.json" "./generated-package/Matrix-anti_BP/texts/"
cp -r "./ac_BP/scripts" "./generated-package/Matrix-anti_BP/scripts"
cp -r "./ac_BP/animations" "./generated-package/Matrix-anti_BP/animations"
cp -r "./ac_BP/functions" "./generated-package/Matrix-anti_BP/functions"
cp -r "./ac_BP/animation_controllers" "./generated-package/Matrix-anti_BP/animation_controllers"
cp -r "./ac_BP/items" "./generated-package/Matrix-anti_BP/items"
cp -r "./ac_BP/recipes" "./generated-package/Matrix-anti_BP/recipes"
cp -r "./ac_BP/entities" "./generated-package/Matrix-anti_BP/entities"

# Copy the resource pack
cp "./ac_RP/pack_icon.png" "./generated-package/Matrix-anti_RP/"
cp "./ac_BP/bug_pack_icon.png" "./generated-package/Matrix-anti_BP/"
cp "./ac_RP/manifest.json" "./generated-package/Matrix-anti_RP/"
cp "./LICENSE" "./generated-package/Matrix-anti_RP/"
mkdir -p "./generated-package/Matrix-anti_RP/texts"
cp -r "./ac_RP/textures" "./generated-package/Matrix-anti_RP/textures"
cp "./ac_RP/texts/"*.lang "./generated-package/Matrix-anti_RP/texts/"
cp "./ac_RP/texts/languages.json" "./generated-package/Matrix-anti_RP/texts/"

echo "Process ended."
read -p "Press any key to continue..." -n1 -s
