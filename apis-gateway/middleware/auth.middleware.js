import axios from 'axios';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.token;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        console.log(authHeader)


        try {
            // Verify token with auth service
            const response = await axios.get(
                `${process.env.AUTH_SERVICE_BASE_URL}/auth/validate-user`,
                {
                    headers: {
                        'token': authHeader
                    }
                }
            );

            // Attach user data to request object
            req.user = response.data;
            next();

        } catch (error) {
            if (error.response) {
                return res.status(error.response.status).json(error.response.data);
            }
            throw error;
        }

    } catch (error) {
        return res.status(500).json({ 
            message: 'Error authenticating token', 
            error: error.message 
        });
    }
}; 