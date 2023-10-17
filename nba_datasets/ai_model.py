import pandas as pd
import numpy as np
import matplotlib as plt


year16 = pd.read_csv("15_16.csv")
year17 = pd.read_csv("16_17.csv")
year18 = pd.read_csv("17_18.csv")
year19 = pd.read_csv("18_19.csv")
year20 = pd.read_csv("19_20.csv")
year21 = pd.read_csv("20_21.csv")
year22 = pd.read_csv("21_22.csv")
year23 = pd.read_csv("22_23.csv")



def filter_player_data(data_table):
    # Count the occurrences of each player in the 'Player' column
    player_counts = data_table['Player'].value_counts()

    # Create a mask to keep rows with 'TOT' in the 'Tm' column or players with only one occurrence
    mask = (data_table['Tm'] == 'TOT') | (data_table['Player'].map(player_counts) == 1)

    # Apply the mask to filter the DataFrame
    filtered_data = data_table[mask]

    return filtered_data


year16 = filter_player_data(year16)
year17 = filter_player_data(year17)
year18 = filter_player_data(year18)
year19 = filter_player_data(year19)
year20 = filter_player_data(year20)
year21 = filter_player_data(year21)
year22 = filter_player_data(year22)
year23 = filter_player_data(year23)


# print(year16_cleaned.head())