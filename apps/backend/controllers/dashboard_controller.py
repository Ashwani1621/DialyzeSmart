from flask import jsonify

from services.dashboard_service import (
    get_dashboard_data,
)


def fetch_dashboard():

    try:

        data = get_dashboard_data()

        return jsonify({

            "success": True,

            "data": data,

        })

    except Exception as e:

        return jsonify({

            "success": False,

            "message": str(e),

        }), 500