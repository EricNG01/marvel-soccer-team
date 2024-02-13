# Getting Started with Marvel Soccer Team

This app allow you to select your 5-aside Marvel soccer Team.
    - Goal Keeper
    -Striker
    -Midfielder
    -Defender
    -Additional player who can be allocated to any outfield spot (Striker, Midfielder or Defender)

## Run the app

In the project directory, run:
    
    npm install
to install all the required dependencies

    npm start
to start the app
It will run at 127.0.0.1:3000 / localhost:3000

## First page
![image](https://github.com/EricNG01/marvel-soccer-team/assets/102510835/6f325647-5756-4007-a7bc-b44fa3a09f5f)

You can select character for any role by pressing one of the five button in the middle. It will lead you to the second page

## Second page
![image](https://github.com/EricNG01/marvel-soccer-team/assets/102510835/0f9b5e09-7e67-495b-92ed-473250eb3fc8)

A random search will be perform at first. You can then search any character you want by the searching bar at the top.
You can also choose any character from the list by pressing their images. It will lead you to the first page.

## Third page
![image](https://github.com/EricNG01/marvel-soccer-team/assets/102510835/56890c34-98f5-4fa4-8219-b0d74bcd4a26)

A larger image of the character, his name and description will be shown on this page.

You can confirm your selection by pressing the confirm button, or cancel this selection by pressing the cancel button.
Both actions will bring you back to the second page.

## Result
![image](https://github.com/EricNG01/marvel-soccer-team/assets/102510835/0b3bfe83-2efd-445d-8e6c-9d1b9a8c91b6)

Here is how the first page look like after selection


## API

The Marvel Comic API is used in this app.
``https://developer.marvel.com/``

## Endpoint
### /v1/public/characters
Search by keywords
### /v1/public/characters/{characterId}
Search by character Id


