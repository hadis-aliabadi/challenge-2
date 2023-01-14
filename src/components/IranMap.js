import React,{Component} from 'react';

import './IranMap.css';

import CityModal from './CityModal';


class IranMap extends Component {

    constructor(props) {
        super(props);
        this.state = {
            citiesData: null,
            selectedCity: null,
            isModalOpen: false,
            isLoading: false,
            error: null,
        };
    }
 
    componentDidMount(){
      this.setState({ isLoading: true });
      fetch("http://localhost:9000/cities/")
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => this.setState({ citiesData: data, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
      
    }

    cityClicked = (id) => (event) => {
        event.preventDefault();
        fetch(`http://localhost:9000/cities/${id}`)
        .then(response => response.json())
        .then(data => this.setState({ selectedCity: data ,isModalOpen:true}))
    };

    closeModal = () => {
        this.setState({
            isModalOpen: false,
        });
    };
   
    render() {
        const { citiesData,selectedCity,isModalOpen ,isLoading, error } = this.state;

        if (error) {
          return <p>{error.message}</p>;
        }
    
        if (isLoading) {
          return <p>Loading ...</p>;
        }
        return (
            <div>
                <div className="map-container">
                    
                    {(citiesData || []).map((record) => (
                        <div
                            key={record.id}
                            className="city-name"
                            style={{
                                top: `${record.top}%`,
                                left: `${record.left}%`,
                            }}
                            onClick={this.cityClicked(record.id)}
                        >
                            {record.name}
                        </div>
                    ))}
                </div>
                <CityModal
                    city={selectedCity}
                    isOpen={isModalOpen}
                    onClose={this.closeModal}
                />
            </div>
        );
    }
}

export default IranMap;
