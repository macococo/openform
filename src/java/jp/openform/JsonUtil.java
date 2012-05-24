package jp.openform;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JsonUtil {

	private JsonUtil() {}
	
	public static JSONObject parse(final String jsonString) {
		try {
			return new JSONObject(jsonString);
		} catch (final JSONException e) {
			throw new JsonRuntimeException(e);
		}
	}
	
	public static String getString(final JSONObject json, final String key) {
		try {
			return json.getString(key);	
		} catch (final JSONException e) {
			throw new JsonRuntimeException(e);
		}
	}
	
	public static Integer getInt(final JSONObject json, final String key) {
		try {
			return json.getInt(key);
		} catch (final JSONException e) {
			throw new JsonRuntimeException(e);
		}
	}
	
	public static Double getDouble(final JSONObject json, final String key) {
		try {
			return json.getDouble(key);
		} catch (final JSONException e) {
			throw new JsonRuntimeException(e);
		}
	}
	
	public static boolean getBoolean(final JSONObject json, final String key) {
		try {
			return json.getBoolean(key);
		} catch (final JSONException e) {
			throw new JsonRuntimeException(e);
		}
	}
	
	public static JSONObject getJsonObject(final JSONObject json, final String key) {
		try {
			return json.getJSONObject(key);	
		} catch (final JSONException e) {
			throw new JsonRuntimeException(e);
		}
	}
	
	public static JSONArray getJsonArray(final JSONObject json, final String key) {
		try {
			return json.getJSONArray(key);	
		} catch (final JSONException e) {
			throw new JsonRuntimeException(e);
		}
	}
	
	public static JSONObject getJsonObjectByArray(final JSONArray array, final int index) {
		try {
			return array.getJSONObject(index);	
		} catch (final JSONException e) {
			throw new JsonRuntimeException(e);
		}
	}
	
	public static JSONArray getJsonArrayByArray(final JSONArray array, final int index) {
		try {
			return array.getJSONArray(index);
		} catch (final JSONException e) {
			throw new JsonRuntimeException(e);
		}
	}
	
	public static void put(final JSONObject json, final String key, final Object value) {
		try {
			json.put(key, value);	
		} catch (final JSONException e) {
			throw new JsonRuntimeException(e);
		}
	}
	
	public static Object getArray(final JSONArray json, final int index) {
		try {
			if (json.length() <= index) return null;
			
			final Object value = json.get(index);
			if (value == JSONObject.NULL) {
				return null;
			}
			return value;
		} catch (final JSONException e) {
			throw new JsonRuntimeException(e);
		}
	}
	
	public static void putArray(final JSONArray json, final int index, final Object value) {
		try {
			json.put(index, value);	
		} catch (final JSONException e) {
			throw new JsonRuntimeException(e);
		}
	}
	
}
