import sys
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# nltk.download('vader_lexicon')
# nltk.download('stopwords')
# nltk.download('punkt')
# nltk.download('wordnet')

# Function to check and download necessary packages
def setup_nltk():
    needed_packages = ['vader_lexicon', 'stopwords', 'punkt', 'wordnet']
    for package in needed_packages:
        try:
            nltk.data.find(package)
        except LookupError:
            nltk.download(package, quiet=True)




def preprocess_text(text):
    lemmatizer = WordNetLemmatizer()
    tokens = word_tokenize(text.lower())
    filtered_tokens = [token for token in tokens if token not in stopwords.words('english')]
    lemmatized_tokens = [lemmatizer.lemmatize(token) for token in filtered_tokens]
    processed_text = ' '.join(lemmatized_tokens)
    return processed_text

def get_sentiment(text):
    setup_nltk()
    analyzer = SentimentIntensityAnalyzer()
    scores = analyzer.polarity_scores(text)
    compound_score = scores['compound']
    if compound_score >= 0.05:
        return 1
    elif compound_score <= -0.05:
        return -1
    else:
        return 0

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 GoSentiment.py 'text to analyze'")
        sys.exit(1)
    
    text = ' '.join(sys.argv[1:])
    # processed_text = preprocess_text(text)
    # sentiment = get_sentiment(processed_text)
    sentiment = get_sentiment(text)
    print(sentiment)