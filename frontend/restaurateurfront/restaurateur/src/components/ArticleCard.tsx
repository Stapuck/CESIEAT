import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';

interface IArticle {
    _id: string;
    name: string;
    reference: string;
    type: 'plat' | 'boisson' | 'sauce' | 'accompagnement';
    price: number;
    isInStock: boolean;
    image?: string;
    restaurantid?: string;
}

const ArticleCard = ({ article, getArticles }: { article: IArticle; getArticles: () => void }) => {
    const deleteArticle = async (id: string) => {
        const result = await Swal.fire({
            title: "Really delete the article?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: 'Yes, Delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`https://localhost/api/articles/${id}`);
                toast.success("Article deleted successfully");
                getArticles();
            } catch (error: any) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className="bg-white rounded shadow-lg overflow-hidden m-3">
            {article.image && <img src={article.image} alt={article.name} className="w-full h-28 object-cover" />}
            <div className="px-4 pt-2 pb-4">
                <h2 className="text font-semibold">{article.name}</h2>
                <div className="text-sm">Reference: {article.reference}</div>
                <div className="text-sm">Type: {article.type}</div>
                <div className="text-sm">Price: {article.price} €</div>
                <div className="text-sm">In Stock: {article.isInStock ? 'Yes' : 'No'}</div>
                <div className="mt-2 flex gap-4">
                    <Link to={`/edit-article/${article._id}`} className="inline-block w-full text-center shadow-md text-sm bg-gray-700 text-white rounded-sm px-4 py-1 font-bold hover:bg-gray-600 hover:cursor-pointer">Edit</Link>
                    <button onClick={() => deleteArticle(article._id)} className="inline-block w-full text-center shadow-md text-sm bg-red-700 text-white rounded-sm px-4 py-1 font-bold hover:bg-red-600 hover:cursor-pointer">Delete</button>
                </div>
            </div>
        </div>
    );
}

export default ArticleCard;
