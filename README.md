## Database viewer

The goal of this app was to make it easier to visualize database and edit data in it.
Kind of CMS. It's just for learning purposes...

I chose new technologies for me and did not succeed yet:

Nextjs
Postgres (on Supabase) for managing DB
sqlite3 for managing user accounts
Prisma

#To use it :

1. clone or fork this repo to your local machine
2. npm i
3. add your database connection string (DATABASE_URL=....)
4. add JWT_SECRET=.... .env.local file

#routes
http://localhost:3000/ok/view-db
shows all tables of your database as hexagons
idea was to connect hexagons of related tables (by foreign keys), but it's not done yet

when you click on small + sign you navigate to
http://localhost:3000/ok/view-db/[your_table_name]
where you can add rows to your table (it's also not working yet)

#TO DO:

1. view data of tables
2. validate data
3. upload images and preview
4. view related tables as connected hexagons
5. colorize columns, which are autoincrement, primary key, not null, foreign key etc...
