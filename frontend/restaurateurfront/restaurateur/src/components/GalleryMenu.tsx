import { useState, useEffect } from 'react';
import axios from 'axios';
import MenuCard from './MenuCard';
import { useAuth } from "react-oidc-context";

interface IRestaurateur {
    _id: string;
    managerName: string;
    email: string;
    restaurantName: string;
    address: string;
    phone: string;
    name: string;
    position: [number, number];
    url: string;
    managerId: string;
  }

function GalleryMenu() {
    const [menus, setMenus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();
    const [restaurant, setRestaurant] = useState<IRestaurateur>();

    

    const getRestaurateurByManagerId = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `http://localhost:8080/api/restaurateurs/manager/${auth.user?.profile.sub}`
            );
            if (response.data.length > 0) {
                setRestaurant(response.data[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    
    const getMenusByRestaurateur = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:8080/api/menus/restaurateur/${restaurant?._id}`);
            setMenus(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

  
    useEffect(() => {
        getRestaurateurByManagerId();
    }, []);
        
    useEffect(() => {
        if (restaurant?._id) {
            getMenusByRestaurateur();
        }
    }, [restaurant]);



    return (
        <div className='grid grid-cols-2 lg:grid-cols-4 mt-5'>
            {isLoading ? ("Loading") : (
                <>
                    {menus.length > 0 ? (
                        <>
                            {menus.map((menu, index) => (
                                <MenuCard key={index} menu={menu} getMenus={getMenusByRestaurateur} />
                            ))}
                        </>
                    ) : (
                        <div>There are no menu</div>
                    )}
                </>
            )}
        </div>
    );
}

export default GalleryMenu;
