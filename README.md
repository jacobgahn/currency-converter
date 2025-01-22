Assignment

Objective

Using Node and Express, your task is to build a currency conversion service that includes FIAT and cryptocurrencies.

Brief

In this challenge, your assignment is to build a service that makes conversions between different currencies. You will connect to an external API to request currency data, log & store requests of your users, and rate limit requests based on specific criteria. Your service must support at least the following currency pairs:

USD EUR BTC ETH

Your code submission should be production quality. Feel free to include an explainer video if you'd like to convey your design decisions to our engineering team of reviewers. This IS NOT a pass/fail assignment. We evaluate candidates wholistically by meeting people where they are. Show us your best work!

Tasks

    Implement assignment using:

        Language: Node

        Framework: Express

    For authentication, you can assume a user ID is attached to the request in the Authorization header. Eg. Authorization: Bearer dab458d6-8352-42e6-88a1-88acc76b4e43

    Your service needs to store each request, the date/time it was performed, its parameters and the response body.

    Your implementation should perform realtime currency conversion.

    We recommend using the Coinbase API for exchange rates: https://developers.coinbase.com/api/v2#get-exchange-rates

    Each user may perform 100 requests per workday (Monday-Friday) and 200 requests per day on weekends. After the quota is used up, you need to return an error message.

    The service must accept the following parameters:

        The source currency, the amount to be converted, and the final currency.

        e.g. ?from=BTC&to=USD&amount=999.20

    Your service must return a JSON response with appropriate values.

Evaluation Criteria

    Does your code follow Node best practices?

    We're looking for production quality, well-structured, working code.

    Completeness: Did you complete the features?

    Maintainability: Is it written in a clean, maintainable way?

    Testing: Are there test that pass, cover all use cases, and lock down functionality to catch regressions?

Help us help you

Please include an explanation in comments, in a README, or by attached video. This helps our reviewing engineers know what you were thinking when you wrote the code, and be your best advocates.