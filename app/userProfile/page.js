"use client";

import Link from "next/link";
import Data from "../_components/data"
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import RecipeList from "../recipeList/page";
import FilterPage from "../filterPage/page";
import Filter from "../filter/page";

function ProfileContent() {
    const searchParams = useSearchParams();
    const userName = searchParams.get("userName");

    return (
        <div>
            <h1 className="text-3xl font-bold">Welcome {userName}!</h1>
            <Data name={userName}/>
            <hr />
            <RecipeList name={userName}/>
            {/* <FilterPage name={userName}/> */}
            <Filter />
            {/* <Link href="../filter" className="text-cyan-600 underline hover:text-cyan-300">Filter All</Link> */}
        </div>
    );
}

export default function Page() {

    

    return (
        <main style={{ maxWidth: 400, margin: "2rem auto" }}>
            <Suspense fallback={<p>Loading user profile...</p>}>
                <ProfileContent />
            </Suspense>
            <Link href="/" className="text-cyan-600 underline hover:text-cyan-300">Home</Link>
        </main>
    );
}