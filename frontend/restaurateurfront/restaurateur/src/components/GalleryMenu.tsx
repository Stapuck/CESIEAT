import { useState, useEffect } from 'react';
import axios from 'axios';
import MenuCard from './MenuCard';
import { useAuth } from "react-oidc-context";


function GalleryMenu() {
    const [menus, setMenus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();

    const getMenusByRestaurateur = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:8080/api/menus/restaurateur/${auth.user?.profile.sub}`);
            setMenus(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
      getMenusByRestaurateur();
    }, []);

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
