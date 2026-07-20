import "./AdminSidebar.css";

import {
    FaHome,
    FaFilm,
    FaUsers,
    FaStar
} from "react-icons/fa";


function AdminSidebar(){


return (

<aside className="admin-sidebar">


<h2>
🎬 Admin
</h2>



<nav>


<a href="/admin">
<FaHome/>
Dashboard
</a>


<a href="/admin/movies">
<FaFilm/>
Movies
</a>



<a href="/admin/users">
<FaUsers/>
Users
</a>



<a href="/admin/reviews">
<FaStar/>
Reviews
</a>



</nav>


</aside>

)


}


export default AdminSidebar;