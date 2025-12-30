import requests
from bs4 import BeautifulSoup

def scrape_website(url):
    """
    This function takes a URL as input, fetches the HTML content of the webpage,
    parses it to extract the title, and then prints the title.
    """
    try:
        # Send a GET request to the specified URL
        response = requests.get(url)
        # Raise an exception for bad status codes (4xx or 5xx)
        response.raise_for_status()

        # Create a BeautifulSoup object to parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find the title tag and extract its text
        title = soup.title.string

        # Print the title of the webpage
        print(f"The title of the page is: {title}")

    except requests.exceptions.RequestException as e:
        # Handle any network-related errors
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Define the URL of the website to scrape
    url_to_scrape = "http://example.com"
    # Call the function to scrape the website
    scrape_website(url_to_scrape)
