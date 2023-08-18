from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask import Response

from urllib.parse import quote_plus

import pandas as pd

# Generate prefix for query
def __get_query_prefix(adults, children):
    if(children==0):
        return str(adults)+'a-'
    return str(adults)+'a,'+str(children)+'c-'

# Check the age group in which age lies
def __get_age_slab(age):
    if age<=24:
        return '18-24'
    elif age<=35:
        return '25-35'
    elif age<=40:
        return '36-40'
    elif age<=45:
        return '41-45'
    elif age<=50:
        return '46-50'
    elif age<='55':
        return '51-55'
    elif age<=60:
        return '56-60'
    elif age<=65:
        return '61-65'
    elif age<=70:
        return '66-70'
    elif age<=75:
        return '71-75'
    return '76-99'

def __get_cover_slab(cover):
    if cover<=500000:
        return '500000'
    elif cover<=700000:
        return '700000'
    elif cover<=1000000:
        return '1000000'
    elif cover<=1500000:
        return '1500000'
    elif cover<=2000000:
        return '2000000'
    elif cover<=2500000:
        return '2500000'
    elif cover<=3000000:
        return '3000000'
    elif cover<=4000000:
        return '4000000'
    elif cover<=5000000:
        return '5000000'
    elif cover<=6000000:
        return '6000000'
    return '7500000'

# Generate csv with premium details
def __create_csv(rates, adults, children, discount_rates):
    discount_list = ['0%']+['50%']*(len(adults)-1+len(children))
    adult_names = [f'Adult {i+1}' for i in range(len(adults))]
    children_names = [f'Child {i+1}' for i in range(len(children))]

    data = {' ':adult_names+children_names,'Base Rate':rates, 'Floater Discount':discount_list, 'Discounted Rate':discount_rates, 'Total (for 1 year)':[sum(discount_rates)]}
    
    df = pd.DataFrame(dict([(key, pd.Series(value)) for key, value in data.items()]))

    # Create a Response with CSV data
    response = Response(df.to_csv(index=False), headers={
                "Content-Disposition": "attachment; filename=Premium.csv",
                "Content-Type": "text/csv",
            })

    return response

# Generate csv with Premium details to return to UI
def premium_cost(adultAges, childrenAges, tenure, cover):
    adults = len(adultAges)
    children = len(childrenAges)
    cover = __get_cover_slab(cover)
    query_prefix = __get_query_prefix(adults, children)
    adultAges.sort(reverse=True)
    
    username = "Enter MongoDB username"
    password = "Enter Password for above user"

    # URL-encode the username and password
    encoded_username = quote_plus(username)
    encoded_password = quote_plus(password)

    uri = f"mongodb+srv://{encoded_username}:{encoded_password}@cluster0.dnredkv.mongodb.net/?retryWrites=true&w=majority"
    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi('1'))

    db = client['oneassure_sde_intern']
    collection = db['Cluster0']

    individual_rates = []
    
    # Premium for Adults
    for age in adultAges:
        query = query_prefix+__get_age_slab(age)
        result = collection.find_one({'_id': query})
        individual_rates.append(result[cover])
    
    # Premium for Children
    avg_age = sum(adultAges)/len(adultAges)
    if children!=0:
        query = query_prefix+__get_age_slab(avg_age)
        result = collection.find_one({'_id': query})
        for i in range(children):
            individual_rates.append(result[cover]/2)

    final_rate_list = []
    final_rate_list.append(individual_rates[0])
    # Floater Discount
    if query_prefix!='1a-':
        for i in range(1,len(individual_rates)):
            final_rate_list.append(individual_rates[i]*0.5)
    
    # Getting CSV for premium details
    response = __create_csv(individual_rates, adultAges, childrenAges, final_rate_list)

    return response