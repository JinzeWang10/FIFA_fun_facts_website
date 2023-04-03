# FIFA_fun_facts_website

### Data Preprocessing

The dataset we get from Kaggle `https://www.kaggle.com/datasets/stefanoleone992/fifa-23-complete-player-dataset?select=male_players.csv` is quite clean. The concentration of preprocessing part is make data easier to load.

Processed file can be found under ./DataReady [Player is not included since it is quite large]

The notebook contains preprocessing can be found under ./DataReady folder

#### Drop useless columns

There are 110 columns in Player dataset, while only part of it is relevant to our project, thus we drop less relevant columns for faster loading.

#### Remove redundancy

For one player of the same fifa version, there are duplicate rows with respect to different fifa update times. Since the data are highly similar to each other, we only keep one of them. With this step, we reduce the number of rows in Player.csv from 10003590 to 196933.

#### Replace comma with dash

We use `LOAD DATA LOCAL INFILE 'filepath' INTO TABLE Team FIELDS TERMINATED BY ','` to load in data, thus, we need to process the dataset to avoid ambiguity. We replace comma in the data entry with dash.

#### Translate into correct datatype

When loading data via pandas, some id columns was recognized as float, we map them to the right datatype for future join.

### Data Loading

The DDL which is stored as a .txt can be found under ./DataReady folder.

You can access the Database via:

Host: dbgroup16-1.cgbfgfr2jat9.us-east-1.rds.amazonaws.com

User: admin

Password: dbgroup16

