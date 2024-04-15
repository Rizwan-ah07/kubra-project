import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { Lamp, Fabrikant } from './interface'; // Make sure these interfaces are correctly defined
import lampsDataJson from './JSON/lamps.json'; // Update the path as necessary
import fabricsDataJson from './JSON/fabrikant.json'; // Update the path as necessary

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));

// Parse JSON data
const lampsData: Lamp[] = lampsDataJson as Lamp[];
const fabricsData: Fabrikant[] = fabricsDataJson as Fabrikant[];

app.get("/", (req: Request, res: Response) => {
    res.render("index", {
        title: "Home",
        message: "Welcome to the Lamps Overview"
    });
});

app.get("/lamps", (req: Request, res: Response) => {
    let searchQuery = req.query.search as string;
    let sortField = req.query.sortField as string || 'naam'; 
    let sortOrder = req.query.sortOrder as string || 'asc';  

    let filteredLamps = lampsData;

    filteredLamps.sort((a: any, b: any) => {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    // Search bar
    if (searchQuery) {
        searchQuery = searchQuery.toLowerCase(); 
        filteredLamps = filteredLamps.filter(lamp =>
            lamp.naam.toLowerCase().includes(searchQuery)
        );
    }

    res.render("lamps", {
        lamps: filteredLamps,
        searchQuery,
        sortField,
        sortOrder
    });
});

app.get("/fabrics", (req: Request, res: Response) => {
    // Similar sorting and searching for fabrics
    res.render("fabrics", { fabrics: fabricsData }); // Simple rendering, add sorting/searching as needed
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
