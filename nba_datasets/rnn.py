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

# use each year to create csvs of all player data
def generate_player_data(year):
    # find all players
    all_players = players.get_active_players()
    print(f"Total number of players: {len(all_players)}")
    counter = 0
    max_retries = 30  # Adjust the maximum number of retries as needed

    for player in all_players:
        id = player["id"]
        csv_filename = player["full_name"].replace(" ", "_") + ".csv"

        os.makedirs("nba_datasets/" + year, exist_ok=True)
        folder_path = "nba_datasets/" + year
        # Define the CSV file path within the "2023" folder
        csv_file_path = os.path.join(folder_path, csv_filename)

        # Check if the file already exists
        if os.path.exists(csv_file_path):
            print(f"File '{csv_filename}' already exists. Skipping. Counter: {counter}")
            counter += 1
            continue
        else:
            retries = 0
            while retries < max_retries:
                try:
                    career = playercareerstats.PlayerCareerStats(player_id=id)
                    career_data = career.get_data_frames()[0]
                    datatable = pd.DataFrame(career_data)
                    datatable.to_csv(csv_file_path, index=False)
                    counter += 1
                    print(f"File '{csv_filename}' saved. Counter: {counter}")
                    break  # Break out of the retry loop if successful
                except Exception as e:
                    print("Error fetching data for player " + player["full_name"] + ". Retry " + str(retries+1) + "/" + str(max_retries) + ". Error: " + e)
                    retries += 1
                    time.sleep(10)  # Add a delay before retrying

            if retries == max_retries:
                print(f"Max retries reached for player {id}. Skipping.")

    if len(all_players) == counter:
        print("Completed all players!")
        
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




# Generate new player data
# generate_player_data("2024")
        
# df_list = read_csv_files_in_folder("2024")

# # for player_data in df_list:
# #     player_data['PPG'] = player_data['PTS'] / player_data['GP']
# #     player_data['PFPG'] = player_data['PF'] / player_data['GP']
# #     player_data['TOVPG'] = player_data['TOV'] / player_data['GP']
# #     player_data['BPG'] = player_data['BLK'] / player_data['GP']
# #     player_data['SPG'] = player_data['STL'] / player_data['GP']
# #     player_data['APG'] = player_data['AST'] / player_data['GP']
# #     player_data['DRPG'] = player_data['DREB'] / player_data['GP']
# #     player_data['ORPG'] = player_data['OREB'] / player_data['GP']
# #     player_data['FTP'] = player_data['FTM'] / player_data['FTA']
# #     player_data['FGP'] = player_data['FGM'] / player_data['FGA']
# #     player_data['TPP'] = player_data['FG3M'] / player_data['FG3A']

# features = ['GP', 'MIN', 'FGM', 'FGA', 'FG3M', 'FG3A', 'FTM', 'FTA', 'OREB', 'DREB', 'AST', 'STL', 'BLK', 'TOV', 'PF', 'PTS']

# sequences = []
# labels = []



# for player_data in df_list:
#     player_features = player_data[features].values

#     for i in range(1, len(player_data)):
#         if i < len(player_data):
#             sequences.append(player_features[:i])
#             labels.append(player_features[i])  # Label is the statistics for the next year


# sequences = pad_sequences(sequences, dtype='float32', padding='post', truncating='post', value=0.0)

# sequences = np.array(sequences)
# labels = np.array(labels)

# X_train, X_test, y_train, y_test = train_test_split(sequences, labels, test_size=0.2, random_state=42)

# # Normalize the data
# scaler = MinMaxScaler()
# X_train_flat = X_train.reshape(-1, len(features))
# X_test_flat = X_test.reshape(-1, len(features))
# X_train_flat_normalized = scaler.fit_transform(X_train_flat)
# X_test_flat_normalized = scaler.transform(X_test_flat)

# # Reshape back to 3D for LSTM input
# X_train = X_train_flat_normalized.reshape(X_train.shape)
# X_test = X_test_flat_normalized.reshape(X_test.shape)

# # Build the LSTM model
# model = Sequential()
# model.add(Masking(mask_value=0.0, input_shape=(None, len(features))))
# model.add(LSTM(50))
# model.add(Dense(len(features)))  # Output layer with the same number of neurons as features
# model.compile(optimizer='adam', loss='mean_squared_error')

# # Train the model
# model.fit(X_train, y_train, epochs=5, batch_size=32, validation_data=(X_test, y_test))



# # Assuming you want to predict for the next year
# # Take the last sequence for each player and make predictions
# # Assuming you want to predict for the next year
# # Take the last sequence for each player and make predictions
# predictions = []
# for player_data in df_list:
#     if len(player_data) >= 2:  # Check if there are enough samples to create a sequence
#         last_sequence = player_data[features].values[-1:]

#         # Add an additional dimension to the input data
#         last_sequence = np.expand_dims(last_sequence, axis=0)  # Add batch dimension
#         last_sequence = np.expand_dims(last_sequence, axis=2)  # Add time dimension

#         last_sequence_flat = last_sequence.reshape(-1, len(features))
#         last_sequence_flat_normalized = scaler.transform(last_sequence_flat)
#         last_sequence_reshaped = last_sequence_flat_normalized.reshape((1, last_sequence.shape[1], len(features)))

#         prediction = model.predict(last_sequence_reshaped)
#         predictions.append(prediction[0])

#         # Debugging prints
#         print(f"Player: {player_data['PLAYER_ID'].iloc[0]}")
#         print("Last Sequence:", last_sequence)
#         print("Last Sequence Normalized:", last_sequence_flat_normalized)
#         print("Predicted Values (Normalized):", prediction)
        
#         # Invert the normalization to get the actual prediction values
#         prediction_inverted = scaler.inverse_transform(prediction.reshape(1, -1))
#         print("Predicted Values (Inverted):", prediction_inverted)
#     else:
#         print(f"Skipping prediction for player with insufficient data:")


df_list = read_csv_files_in_folder("2024")

features = ['GP', 'MIN', 'FGM', 'FGA', 'FG3M', 'FG3A', 'FTM', 'FTA', 'OREB', 'DREB', 'AST', 'STL', 'BLK', 'TOV', 'PF', 'PTS']

sequences = []
labels = []

df_list = [df.iloc[:-1] for df in df_list]

for player_data in df_list:
    player_features = player_data[features].values

    for i in range(1, len(player_data)):
        if i < len(player_data):
            sequences.append(player_features[:i])
            labels.append(player_features[i])  # Label is the statistics for the next year

sequences = pad_sequences(sequences, dtype='float32', padding='post', truncating='post', value=0.0)

sequences = np.array(sequences)
labels = np.array(labels)

X_train, X_test, y_train, y_test = train_test_split(sequences, labels, test_size=0.2, random_state=42)

# Build the LSTM model without normalization
model = Sequential()
model.add(Masking(mask_value=0.0, input_shape=(None, len(features))))
model.add(LSTM(50))
model.add(Dense(len(features)))  # Output layer with the same number of neurons as features
model.compile(optimizer='adam', loss='mean_squared_error')

# Train the model
model.fit(X_train, y_train, epochs=100000, batch_size=32, validation_data=(X_test, y_test))

# Make predictions without normalization
predictions = []
player_info_list = []

for player_data in df_list:
    if len(player_data) >= 1:  # Check if there are enough samples to create a sequence
        last_sequence = player_data[features].values[-1:]

        # Add an additional dimension to the input data
        last_sequence = np.expand_dims(last_sequence, axis=0)  # Add batch dimension
        last_sequence = np.expand_dims(last_sequence, axis=2)  # Add time dimension

        last_sequence_reshaped = last_sequence.reshape((1, last_sequence.shape[1], len(features)))

        prediction = model.predict(last_sequence_reshaped)
        predictions.append(prediction[0])
        player_info_list.append(player_data.iloc[-1])  # Add the last row (player information)

        # Debugging prints
        print(f"Player: {player_data['PLAYER_ID'].iloc[0]}")
        print("Last Sequence:", last_sequence)
        print("Predicted Values:", prediction)
    else:
        print(f"Skipping prediction for player with insufficient data:")

# Create DataFrame for predictions
prediction_df = pd.DataFrame(predictions, columns=features)

# Concatenate with player information
player_info_df = pd.DataFrame(player_info_list)
prediction_df = pd.concat([player_info_df.reset_index(drop=True), prediction_df], axis=1)

# Add Player_Name based on Player_ID
prediction_df['Player_Name'] = prediction_df['PLAYER_ID'].apply(lambda x: players.find_player_by_id(x)["full_name"])

# Display the filled prediction_df
print(prediction_df.columns)
print(prediction_df.head())


# Export DataFrame to CSV file
prediction_df.to_csv('prediction_results_2024.csv', index=False)
