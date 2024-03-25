import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import Layout from "../containers/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import EditProfile from "../pages/EditProfile";
import Profile from "../pages/Profile";
import UploadPhoto from "../pages/UploadPhoto";
import EditAlbum from "../pages/EditAlbum";
import ShowPhotos from "../pages/ShowPhotos";

export const App = () => {
  return (
    <BrowserRouter>
        <Layout>
            <Routes>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/regis" element={<Register />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/editprofile" element={<EditProfile />}/>
            <Route path="/subirfoto" element={<UploadPhoto />}/>
            <Route path="/editalbum" element={<EditAlbum />}/>
            <Route path="/fotos" element={<ShowPhotos />}/>
            </Routes>
        </Layout>   
    </BrowserRouter>
  );
};