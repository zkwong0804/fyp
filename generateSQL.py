lines = """DROP TABLE routes_google;
DROP TABLE routes_bings;
DROP TABLE Places;

CREATE TABLE Places (
    ID INT AUTO_INCREMENT,
    name VARCHAR(255),
    lat DOUBLE,
    lng DOUBLE,
    PRIMARY KEY (ID)
);

CREATE TABLE routes_googles (
    ID INT AUTO_INCREMENT,
    duration DOUBLE,
    distance DOUBLE,
    total_tolls INT,
    time INT,
    dow INT,
    day INT,
    month INT,
    year INT,
    d DATETIME,
    origin INT,
    destination INT,
    PRIMARY KEY (ID),
    FOREIGN KEY (origin) REFERENCES Places(ID),
    FOREIGN KEY (destination) REFERENCES Places(ID)
);

CREATE TABLE routes_bings (
    ID INT AUTO_INCREMENT,
    duration DOUBLE,
    distance DOUBLE,
    total_tolls INT,
    time INT,
    dow INT,
    day INT,
    month INT,
    year INT,
    d DATETIME,
    origin INT,
    destination INT,
    PRIMARY KEY (ID),
    FOREIGN KEY (origin) REFERENCES Places(ID),
    FOREIGN KEY (destination) REFERENCES Places(ID)
);

INSERT INTO Places (name, lat, lng) VALUES("6 Miles Jalan Kota Tinggi,, Jalan Pandan, 81100 Johor Bahru, Johor, Malaysia", 1.5245541, 103.7703317);
INSERT INTO Places (name, lat, lng) VALUES("213, Jalan Kenanga 29/2, Bandar Indahpura, 81000 Kulai, Johor, Malaysia", 1.6413358, 103.6185577);"""
dow_count = 2
for month in range (1, 13):
    totalDays = 0
    if month==1 or month==3 or month==5 or month==7 or month==8 or month==10 or month ==12:
        totalDays = 32;
    elif month==2:
        totalDays = 29;
    else:
        totalDays = 31;
    for days in range (1, totalDays):
        weekend = 0
        
        if dow_count == 6 or dow_count == 7:
            weekend = 0.3

        for hrs in range (0, 24):
            peak_time = 0
            if ((hrs > 7 and hrs < 12) or (hrs > 16 and hrs < 22) and weekend == 0):
                peak_time = 0.3
            
            duration = 1587*(1+peak_time+weekend)
            distance = 29564
            lines += "\nINSERT INTO routes_googles (duration, distance, total_tolls, time, dow, day, month, year, d, origin, destination) VALUES ({}, {}, {}, {}, {}, {}, {}, {}, str_to_date('{}-{}-{}', '%Y-%c-%d'), {}, {});".format(duration, distance, 0, hrs, dow_count, days, month, 2019, 2019, month, days, 1, 2);
            lines += "\nINSERT INTO routes_bings (duration, distance, total_tolls, time, dow, day, month, year, d, origin, destination) VALUES ({}, {}, {}, {}, {}, {}, {}, {}, str_to_date('{}-{}-{}', '%Y-%c-%d'), {}, {});".format(duration, distance, 0, hrs, dow_count, days, month, 2019, 2019, month, days, 1, 2);
        dow_count= (dow_count+1)%7




script = open("database.sql", "w")
script.write(lines);
script.close()
print("database.sql is generated!")

