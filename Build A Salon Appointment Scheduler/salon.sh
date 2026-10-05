#!/bin/bash
PSQL="psql --username=freecodecamp --dbname=salon -t --no-align -c"

echo -e "\n~~~~~ MY SALON ~~~~~\n"
echo -e "\nWelcome to My Salon, how can I help you?\n"

GREETING(){
  SERVICES=$($PSQL "SELECT service_id, name FROM services")
  while IFS='|' read SERVICE_ID NAME
  do
    echo "$SERVICE_ID) $NAME"
  done <<< "$SERVICES"
}

GREETING
read SERVICE_ID_SELECTED

SERVICE_NAME=$($PSQL "SELECT name FROM services WHERE service_id='$SERVICE_ID_SELECTED'")

if [[ -z $SERVICE_NAME ]]
then
  echo -e "\nI could not find that service. What would you like today?\n"
  GREETING
  read SERVICE_ID_SELECTED
  SERVICE_NAME=$($PSQL "SELECT name FROM services WHERE service_id='$SERVICE_ID_SELECTED'")
fi

echo -e "\nWhat's your phone number?\n"
read CUSTOMER_PHONE

REGISTERED_NUMBER=$($PSQL "SELECT phone FROM customers WHERE phone='$CUSTOMER_PHONE'")

if [[ -z $REGISTERED_NUMBER ]]
then
  echo -e "\nI don't have a record for that phone number, what's your name?"
  read CUSTOMER_NAME
  NEW_CUSTOMER=$($PSQL "INSERT INTO customers(phone, name) VALUES('$CUSTOMER_PHONE', '$CUSTOMER_NAME')")
  
  if [[ $NEW_CUSTOMER = "INSERT 0 1" ]]
  then
    echo -e "\nI have now registered your details in my records"
    echo -e "What time would you like your $SERVICE_NAME, $CUSTOMER_NAME?"
    read SERVICE_TIME
    CUSTOMER_ID=$($PSQL "SELECT customer_id FROM customers WHERE name='$CUSTOMER_NAME'")
    NEW_APPOINTMENT=$($PSQL "INSERT INTO appointments(time, customer_id, service_id) VALUES('$SERVICE_TIME','$CUSTOMER_ID','$SERVICE_ID_SELECTED')")
    if [[ $NEW_APPOINTMENT = "INSERT 0 1" ]]
    then
      echo -e "I have put you down for a $SERVICE_NAME at $SERVICE_TIME, $CUSTOMER_NAME."
    fi
  fi
fi