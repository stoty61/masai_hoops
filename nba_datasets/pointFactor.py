import pandas as pd
import numpy as np
import matplotlib as plt
from player import Player
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.endpoints import commonplayerinfo
from nba_api.stats.static import players
import os
import time
import warnings
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from keras.models import Sequential
from keras.layers import LSTM, Dense, Masking
from keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import MinMaxScaler
import tensorflow as tf
from keras.callbacks import ModelCheckpoint
from keras.models import load_model
from nba_api.stats.endpoints import LeagueDashTeamStats

def combine_rows(df):
    # Identify rows with duplicate SEASON_ID
    duplicate_seasons = df[df.duplicated(subset=['SEASON_ID'], keep=False)]

    # Filter the DataFrame based on conditions
    df_filtered = pd.concat([
        df[(df['SEASON_ID'].isin(duplicate_seasons['SEASON_ID'])) & (df['TEAM_ABBREVIATION'] == 'TOT')],
        df[~df['SEASON_ID'].isin(duplicate_seasons['SEASON_ID'])]
    ])

    df_filtered = df_filtered.reset_index(drop=True)

    return df_filtered


def read_csv_files_in_folder(year):
    """
    Reads all CSV files in a folder and returns a list of DataFrames.

    Parameters:
    - folder_path (str): The path to the folder containing CSV files.

    Returns:
    - List of pandas DataFrames.
    """

    os.makedirs("nba_datasets/" + year, exist_ok=True)
    folder_path = "nba_datasets/" + year

    # List all files in the folder
    files = os.listdir(folder_path)

    # Initialize an empty list to store DataFrames
    dataframes_list = []

    # Loop through each file in the folder
    for file in files:
        # Check if the file is a CSV file
        if file.endswith(".csv"):
            # Construct the full path to the CSV file
            file_path = os.path.join(folder_path, file)

            # Read the CSV file into a DataFrame
            df_first = pd.read_csv(file_path)
            df_first = df_first.drop('FG_PCT', axis=1)
            df_first = df_first.drop('FG3_PCT', axis=1)
            df_first = df_first.drop('FT_PCT', axis=1)
            df = combine_rows(df_first)

            # Append the DataFrame to the list
            dataframes_list.append(df)

    return dataframes_list

def list_to_df(df_list):
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        # Display the resulting DataFrame
        return pd.concat(df_list, ignore_index=True)


df_list = read_csv_files_in_folder("2024")

# Function to get the league average PPG for a given season
def get_league_avg_ppg(season):
    # Get team stats for the given season
    team_stats = LeagueDashTeamStats(
        season=season,
        per_mode_detailed='PerGame',  # Per game stats
    ).get_data_frames()[0]
    
    # Calculate the league average PPG by taking the average of all teams' PPG
    league_avg_ppg = team_stats['PTS'].mean()
    return league_avg_ppg

# Loop over the past 20 seasons to get league averages
start_season = '2003-04'
end_season = '2022-23'

# Generate a list of seasons from 2003-04 to 2022-23
seasons = [f'{y1}-{str(y2)[-2:]}' for y1, y2 in zip(range(2003, 2023), range(2004, 2024))]

# Store the league averages for each season
league_avg_ppgs = {}

for season in seasons:
    league_avg_ppgs[season] = get_league_avg_ppg(season)

# Convert the league average PPGs to a DataFrame for easier plotting
df = pd.DataFrame.from_dict(league_avg_ppgs, orient='index', columns=['PPG'])

print(df)
