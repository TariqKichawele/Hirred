import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
    const [ data, setData ] = useState(undefined);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(null);

    const { session } = useSession();

    const fn = async (...args) => {
        setLoading(true)
        setError(null)

        try {
            const supabaseAccessToken = await session.getToken({
                template: 'supabase'
            });
            const res = await cb(supabaseAccessToken, options, ...args);
            setData(res)
            setError(null)
        } catch (error) {
            setError(error)
        } finally {
            setLoading(false)
        }
    };

    return { data, error, loading, fn };
}

export default useFetch;