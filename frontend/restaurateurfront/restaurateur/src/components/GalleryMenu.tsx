import { useState, useEffect } from 'react';
import axios from 'axios';
import MenuCard from './MenuCard';

function GalleryMenu() {
    const [menus, setMenus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getMenus = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("http://localhost:3006/api/menus");
            setMenus(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
      getMenus();
    }, []);

    return (
        <div className='grid grid-cols-2 lg:grid-cols-4 mt-5'>
            {isLoading ? ("Loading") : (
                <>
                    {menus.length > 0 ? (
                        <>
                            {menus.map((menu, index) => (
                                <MenuCard key={index} menu={menu} getMenus={getMenus} />
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
