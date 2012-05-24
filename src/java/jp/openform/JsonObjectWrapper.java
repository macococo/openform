package jp.openform;

import org.json.JSONObject;

public abstract class JsonObjectWrapper {

	protected final JSONObject data;
	
	public JsonObjectWrapper() {
		this(new JSONObject());
	}
	
	public JsonObjectWrapper(final JSONObject data) {
		this.data = (data != null) ? data : new JSONObject();
	}
	
	public JSONObject toJson() {
		return data;
	}

	@Override
	public String toString() {
		return toJson().toString();
	}
	
}
