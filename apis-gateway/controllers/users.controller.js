import axios from 'axios';
import geoip from 'geoip-lite';
export const loginUser = async (req, res) => {
    try {
        const { login_name, user_pwd } = req.body;
        if (!login_name || !user_pwd) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Make request to authentication service
        const authResponse = await axios.post(
            `${process.env.AUTH_SERVICE_BASE_URL}/auth/authenticate-user`,
            {
                login_name,
                user_pwd
            }
        );
        const metadataResponse = await axios.get(
            `${process.env.METADATA_SERVICE_BASE_URL}/metadata/users/get-by-userid/${authResponse.data.user.id}`, 
            {
                headers:
                {
                    client_id: process.env.CLIENT_ID
                }
            }
        );
        return res.status(200).json(  {...authResponse.data, lifespin_metadata:metadataResponse.data});

    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({ 
            message: 'Error logging in', 
            error: error.message 
        });
    }
};

export const locationGuard = async (req, res) => {
    try {
        const clientIp = req.header('x-forwarded-for')
        const location = geoip.lookup(clientIp);
        return res.json(
            {
                "location": location || 'localhost'
            }
        )

    } catch (error) {
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        res.status(500).json({
            message: 'Error updating location',
            error: error.message
        });
    }
};
