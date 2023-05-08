import {FC} from "react";
import usePageTitle from "../hooks/usePageTitle";
import {useSpotifyApi} from "../hooks/useSpotifyApi";

const Tracks: FC = () => {
	usePageTitle('Tracks');
	const spotifyApi = useSpotifyApi();

};

export default Tracks;
