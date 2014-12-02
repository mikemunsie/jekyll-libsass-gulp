#!/bin/bash

echo "
=============================
Do you have Brew?
=============================
";

if type brew>/dev/null;
then
  echo "Yes!";
else
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)";
fi;

echo "
=============================
Do you have NPM?
=============================
";

if type npm>/dev/null;
then
  echo "Yes!";
else
  brew install npm;
fi;


echo "
=============================
Do you have GulpJS?
=============================
";

if type gulp>/dev/null;
then
  echo "Yes!";
else
  sudo npm install --global gulp;
fi;

echo "
=============================
Do you have Bower?
=============================
";

if type bower>/dev/null;
then
  echo "Yes!";
else
  sudo npm install -g bower;
fi;

echo "
=============================
Do you have Bundler?
=============================
";

if type bundle>/dev/null;
then
  echo "Yes!";
else
  sudo gem install bundler;
fi;

echo "
=============================
Installing Dependencies
=============================
";

bundle install;
npm install;
bower install;

echo "
=============================
COMPLETE!
=============================

No go develop :)
";