export default async function getAllShops(){
    
    const response = await fetch(`${process.env.BACKEND_URL}/api/v1/shops`)

    if(!response.ok){
        throw new Error("Failed to Get all shops")
    }

    return await response.json();
}