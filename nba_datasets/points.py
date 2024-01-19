import pandas as pd
import numpy as np
import matplotlib as plt



class Points:
    def __init__(self, data_frame):
        """
        Initializes the Player class with a pandas DataFrame.

        Parameters:
        - data_frame (pd.DataFrame): The DataFrame containing player data.
        """
        self.stats = CleanData(RemoveAfterCareer(data_frame))
        self.predicted_stats = None
        self.name = None

        


def CleanData(data_frame):
    """
    Cleans the player data by removing any rows with missing values.

    Returns:
    - pd.DataFrame: Cleaned DataFrame.
    """
    data_frame = data_frame.drop('Season', axis=1)
    cleaned_data = data_frame.dropna()
    return cleaned_data
    
 



def RemoveAfterCareer(data_frame):
    """
    Removes all rows including and after the row where Season = "Career".

    Returns:
    - pd.DataFrame: DataFrame with rows removed.
    """
    # Find the index where Season is "Career"
    career_index = data_frame.index[data_frame['Season'] == 'Career']

    if not career_index.empty:
        # If "Career" is found, truncate the DataFrame up to that index
        truncated_data = data_frame.iloc[:career_index[0] + 1]
        return truncated_data
    else:
        # If "Career" is not found, return the original DataFrame
        return data_frame