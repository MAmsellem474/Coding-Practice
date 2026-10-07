#!/bin/bash

#Script to query elements from periodic_table database
PSQL="psql --username=freecodecamp --dbname=periodic_table -t --no-align -c"

if [[ -z $1 ]]
then
  echo "Please provide an element as an argument."
  exit
fi

if [[ $1 =~ ^[0-9]+$ ]]
then 
  QUERY_RESULT=$($PSQL "SELECT atomic_number, symbol, name, atomic_mass, melting_point_celsius, boiling_point_celsius, type FROM elements JOIN properties USING(atomic_number) JOIN types USING(type_id) WHERE atomic_number='$1'")
elif [[ $1 =~ ^[A-Z][a-z]?$ ]]
then
  QUERY_RESULT=$($PSQL "SELECT atomic_number, symbol, name, atomic_mass, melting_point_celsius, boiling_point_celsius, type FROM elements JOIN properties USING(atomic_number) JOIN types USING(type_id) WHERE symbol='$1'")
else
  QUERY_RESULT=$($PSQL "SELECT atomic_number, symbol, name, atomic_mass, melting_point_celsius, boiling_point_celsius, type FROM elements JOIN properties USING(atomic_number) JOIN types USING(type_id) WHERE name='$1'")
fi

if [[ -z $QUERY_RESULT ]]
then
  echo "I could not find that element in the database."
  exit
else
  IFS="|" read ATOMIC_NUMBER SYMBOL NAME ATOMIC_MASS MELTING_POINT BOILING_POINT TYPE <<< "$QUERY_RESULT"
  echo "The element with atomic number "$ATOMIC_NUMBER" is "$NAME" ("$SYMBOL"). It's a "$TYPE", with a mass of "$ATOMIC_MASS" amu. "$NAME" has a melting point of "$MELTING_POINT" celsius and a boiling point of "$BOILING_POINT" celsius".
fi
