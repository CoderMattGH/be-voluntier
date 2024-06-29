#!/bin/bash
echo Compiling TS files!
npm run build

if [ $? -eq 0 ]; then
  echo Running program!
  npm start
else
  echo Compilation failed!
fi