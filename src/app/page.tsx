"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRouter } from "next/navigation";

export default function Home() {
  const [cities, setCities] = useState<any[]>([]);
  const [fetchedCities, setFetchedCities] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=${
          page * 20
        }`
      );
      const newCities = response.data.results.map((record: any) => ({
        cityName: record.name,
        countryName: record.cou_name_en,
        timezone: record.timezone,
        coordinates: record.coordinates,
      }));
      setFetchedCities(newCities);
      const mergedCities = [...cities, ...newCities];
      setCities(mergedCities);
      setPage(page + 1);
      if (newCities.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    // Filter cities based on search term locally
    const filteredCities = fetchedCities.filter((city: any) =>
      city.cityName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCities(filteredCities);
  };

  // const handleCityClick = (cityName: string) => {
  //   router.push(`/weather/${encodeURIComponent(cityName)}`);
  // };
  // Home.tsx (Updated handleCityClick function)

  const handleCityClick = (city: any) => {
    const { coordinates } = city;
    if (coordinates) {
      const { lat, lon } = coordinates;
      router.push(`/weather?latitude=${lat}&longitude=${lon}`);
    }
  };

  const handleContextMenu = (
    event: React.MouseEvent<HTMLDivElement>,
    cityName: string
  ) => {
    event.preventDefault();
    window.open(`/weather/${encodeURIComponent(cityName)}`, "_blank");
  };

  const handleSort = (column: string) => {
    const direction =
      sortBy === column ? (sortDirection === "asc" ? "desc" : "asc") : "asc";
    setSortBy(column);
    setSortDirection(direction);
    const sortedCities = [...cities].sort((a, b) => {
      if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
      if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setCities(sortedCities);
  };

  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("/bgImg.jpg")' }}
      >
        <div className="absolute inset-0 bg-black opacity-70 blur"></div>
      </div>
      <div className="min-h-screen bg-gray-900 text-white relative z-10">
        <div className="container mx-auto py-8">
          <input
            type="text"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring focus:border-blue-300"
          />
          <div className="mt-8">
            <InfiniteScroll
              dataLength={cities.length}
              next={fetchData}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              endMessage={<p>No more cities to load</p>}
            >
              <table className="w-full">
                <thead>
                  <tr>
                    <th
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => handleSort("cityName")}
                    >
                      City Name{" "}
                      {sortBy === "cityName" &&
                        (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => handleSort("countryName")}
                    >
                      Country{" "}
                      {sortBy === "countryName" &&
                        (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-4 py-2 cursor-pointer"
                      onClick={() => handleSort("timezone")}
                    >
                      Timezone{" "}
                      {sortBy === "timezone" &&
                        (sortDirection === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-4 py-2">Map</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">
                        <Link
                          href={`/weather/${encodeURIComponent(city.cityName)}`}
                        >
                          <div
                            className="text-blue-500 hover:underline"
                            onClick={() => handleCityClick(city.cityName)}
                            onContextMenu={(
                              event: React.MouseEvent<HTMLDivElement>
                            ) => handleContextMenu(event, city.cityName)}
                          >
                            {city.cityName}
                          </div>
                        </Link>
                      </td>
                      <td className="border px-4 py-2">{city.countryName}</td>
                      <td className="border px-4 py-2">{city.timezone}</td>
                      <td className="border px-4 py-2">
                        <a
                          href={`https://www.google.com/maps?q=${city.coordinates.lat},${city.coordinates.lon}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          View Map
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
}
