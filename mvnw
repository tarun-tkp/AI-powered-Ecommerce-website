#!/bin/sh
# ----------------------------------------------------------------------------
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
# ----------------------------------------------------------------------------

# ----------------------------------------------------------------------------
# Maven Start Up Batch script
#
# Required ENV vars:
# ------------------
#   JAVA_HOME - location of a JDK home dir
#
# Optional ENV vars
# -----------------
#   MAVEN_BATCH_ECHO - set to 'on' to enable the echoing of the batch commands
#   MAVEN_BATCH_PAUSE - set to 'on' to wait for a keystroke before ending
#   MAVEN_OPTS - parameters passed to the Java VM when running Maven
#     e.g. to debug Maven itself, use
#       set MAVEN_OPTS=-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=y,address=8000
#   MAVEN_SKIP_RC - flag to disable loading of mavenrc files
# ----------------------------------------------------------------------------

if [ -z "$MAVEN_SKIP_RC" ] ; then

  if [ -f /usr/local/etc/mavenrc ] ; then
    . /usr/local/etc/mavenrc
  fi

  if [ -f /etc/mavenrc ] ; then
    . /etc/mavenrc
  fi

  if [ -f "$HOME/.mavenrc" ] ; then
    . "$HOME/.mavenrc"
  fi

fi

# OS specific support.  $var _must_ be set to either true or false.
cygwin=false;
darwin=false;
mingw=false
case "`uname`" in
  CYGWIN*) cygwin=true ;;
  MINGW*) mingw=true;;
  Darwin*) darwin=true
    # Use /usr/libexec/java_home if available, otherwise fall back to /Library/Java/Home
    # See https://developer.apple.com/library/mac/technotes/tn2009/tn2110.html
    [ -z "$JAVA_HOME" ] && JAVA_HOME=$(/usr/libexec/java_home)
    ;;
esac

if [ -z "$JAVA_HOME" ] ; then
  if [ -r /etc/gentoo-release ] ; then
    JAVA_HOME=`java-config --jre-home`
  fi
fi

if [ -z "$JAVA_HOME" ]; then
  javaExecutable="`which javac`"
  if [ -n "$javaExecutable" ] && ! [ "`expr \"$javaExecutable\" : '\([^ ]*\)'`" = "no" ]; then
    # readlink(1) is not available as standard on Solaris 10.
    readLink=`which readlink`
    if [ ! `expr "$readLink" : '\([^ ]*\)'` = "no" ]; then
      if $darwin ; then
        javaHome="`dirname \"$javaExecutable\"`"
        javaExecutable="`cd \"$javaHome\" && pwd -P`/javac"
      else
        javaExecutable="`readlink -f \"$javaExecutable\"`"
      fi
      javaHome="`dirname \"$javaExecutable\"`"
      javaHome=`expr "$javaHome" : '\(.*\)/bin'`
      JAVA_HOME="$javaHome"
      export JAVA_HOME
    fi
  fi
fi

if [ -z "$JAVA_HOME" ]; then
  javaExecutable="`which java`"
  if [ -n "$javaExecutable" ] && ! [ "`expr \"$javaExecutable\" : '\([^ ]*\)'`" = "no" ]; then
    # readlink(1) is not available as standard on Solaris 10.
    readLink=`which readlink`
    if [ ! `expr "$readLink" : '\([^ ]*\)'` = "no" ]; then
      if $darwin ; then
        javaHome="`dirname \"$javaExecutable\"`"
        javaExecutable="`cd \"$javaHome\" && pwd -P`/java"
      else
        javaExecutable="`readlink -f \"$javaExecutable\"`"
      fi
      javaHome="`dirname \"$javaExecutable\"`"
      javaHome=`expr "$javaHome" : '\(.*\)/bin'`
      JAVA_HOME="$javaHome"
      export JAVA_HOME
    fi
  fi
fi

if [ -z "$JAVA_HOME" ]; then
  echo "Error: JAVA_HOME environment variable is not set."
  echo "Please set the JAVA_HOME variable in your environment to match the"
  echo "location of your Java installation."
  exit 1
fi

if [ ! -d "$JAVA_HOME" ]; then
  echo "Error: JAVA_HOME is set to an invalid directory: $JAVA_HOME"
  echo "Please set the JAVA_HOME variable in your environment to match the"
  echo "location of your Java installation."
  exit 1
fi

if [ ! -f "$JAVA_HOME/bin/java" ] && [ ! -f "$JAVA_HOME/bin/java.exe" ]; then
  echo "Error: JAVA_HOME is set to an invalid directory: $JAVA_HOME"
  echo "Please set the JAVA_HOME variable in your environment to match the"
  echo "location of your Java installation."
  exit 1
fi

# For Cygwin, ensure paths are in UNIX format before anything is touched
if $cygwin ; then
  [ -n "$JAVA_HOME" ] && JAVA_HOME=`cygpath --unix "$JAVA_HOME"`
  [ -n "$CLASSPATH" ] && CLASSPATH=`cygpath --path --unix "$CLASSPATH"`
fi

# For Mingw, ensure paths are in UNIX format before anything is touched
if $mingw ; then
  [ -n "$JAVA_HOME" ] && JAVA_HOME="`(cd "$JAVA_HOME"; pwd)`"
  [ -n "$CLASSPATH" ] && CLASSPATH="`(cd "$CLASSPATH"; pwd)`"
fi

if [ -z "$JAVA_HOME" ]; then
  echo "Error: JAVA_HOME environment variable is not set."
  echo "Please set the JAVA_HOME variable in your environment to match the"
  echo "location of your Java installation."
  exit 1
fi

# For Cygwin, switch paths to Windows format before running java
if $cygwin ; then
  JAVA_HOME=`cygpath --path --windows "$JAVA_HOME"`
  CLASSPATH=`cygpath --path --windows "$CLASSPATH"`
fi

# Traverse up the directory tree to find .mvn directory
if [ -z "$MAVEN_PROJECTBASEDIR" ]; then
  # Find the project base dir, i.e. the directory that contains the folder ".mvn".
  # Fallback to current working directory if not found.
  WDIR=$(pwd)
  while [ ! -d "$WDIR/.mvn" ] && [ "$WDIR" != '/' ] ; do
    WDIR=$(cd "$WDIR/.."; pwd)
  done
  MAVEN_PROJECTBASEDIR=$WDIR
  if [ ! -d "$MAVEN_PROJECTBASEDIR/.mvn" ]; then
    MAVEN_PROJECTBASEDIR=$(pwd)
  fi
  export MAVEN_PROJECTBASEDIR
fi

# Provide a "standardized" way to retrieve the CLI args that will
# work with both Windows and non-Windows executions.
MAVEN_CMD_LINE_ARGS="$MAVEN_CONFIG $@"
export MAVEN_CMD_LINE_ARGS

WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

# For Cygwin, switch paths to Windows format before running java
if $cygwin ; then
  exec "$JAVA_HOME/bin/java.exe" \
    $MAVEN_OPTS \
    $MAVEN_DEBUG_OPTS \
    -classpath "$MAVEN_PROJECTBASEDIR/.mvn/wrapper/maven-wrapper.jar" \
    "-Dmaven.home=${M2_HOME}" \
    "-Dmaven.multiModuleProjectDirectory=${MAVEN_PROJECTBASEDIR}" \
    ${WRAPPER_LAUNCHER} $MAVEN_CONFIG "$@"
else
  exec "$JAVA_HOME/bin/java" \
    $MAVEN_OPTS \
    $MAVEN_DEBUG_OPTS \
    -classpath "$MAVEN_PROJECTBASEDIR/.mvn/wrapper/maven-wrapper.jar" \
    "-Dmaven.home=${M2_HOME}" \
    "-Dmaven.multiModuleProjectDirectory=${MAVEN_PROJECTBASEDIR}" \
    ${WRAPPER_LAUNCHER} $MAVEN_CONFIG "$@"
fi
