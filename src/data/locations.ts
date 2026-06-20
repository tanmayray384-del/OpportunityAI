export interface State {
  name: string;
  cities: string[];
}

export interface Country {
  name: string;
  states: State[];
}

export const COUNTRIES_DATA: Country[] = [
  {
    name: 'India',
    states: [
      { name: 'Karnataka', cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'] },
      { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane'] },
      { name: 'Delhi', cities: ['New Delhi', 'Dwarka', 'Rohini', 'Vasant Kunj'] },
      { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'] },
      { name: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam'] },
      { name: 'Odisha', cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri'] }
    ]
  },
  {
    name: 'United States',
    states: [
      { name: 'California', cities: ['San Francisco', 'Los Angeles', 'San Diego', 'San Jose'] },
      { name: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Syracuse'] },
      { name: 'Washington', cities: ['Seattle', 'Tacoma', 'Spokane'] },
      { name: 'Texas', cities: ['Austin', 'Dallas', 'Houston', 'San Antonio'] }
    ]
  },
  {
    name: 'United Kingdom',
    states: [
      { name: 'England', cities: ['London', 'Manchester', 'Birmingham', 'Leeds'] },
      { name: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'] }
    ]
  },
  {
    name: 'Germany',
    states: [
      { name: 'Berlin State', cities: ['Berlin'] },
      { name: 'Bavaria', cities: ['Munich', 'Nuremberg', 'Augsburg'] }
    ]
  },
  {
    name: 'Japan',
    states: [
      { name: 'Tokyo Prefecture', cities: ['Tokyo', 'Hachioji', 'Chofu'] },
      { name: 'Osaka Prefecture', cities: ['Osaka', 'Sakai', 'Toyonaka'] }
    ]
  }
];
