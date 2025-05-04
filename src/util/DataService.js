import { 
    URI_CARRIER, 
    URI_TYPE, 
    URI_REASON, 
    URI_AIRCRAFT 
} from './UriConstants';

export const fetchCarriers = () => fetch(URI_CARRIER).then(res => res.json());
export const fetchTypes = () => fetch(URI_TYPE).then(res => res.json());
export const fetchReasons = () => fetch(URI_REASON).then(res => res.json());
export const fetchAircraft = () => fetch(URI_AIRCRAFT).then(res => res.json());

export const fetchEventHistory = (url) => fetch(url).then(res => res.json());

export const buildFilterUrl = (baseUrl, filters) => {
    const url = new URL(baseUrl, window.location.origin);
    Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, v));
        } else if (value) {
            url.searchParams.append(key, value);
        }
    });
    return url;
};
  