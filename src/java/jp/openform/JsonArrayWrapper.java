package jp.openform;

import org.json.JSONArray;

public abstract class JsonArrayWrapper {

	protected final JSONArray data;
	
	public JsonArrayWrapper() {
		this(new JSONArray());
	}
	
	public JsonArrayWrapper(final JSONArray data) {
		this.data = (data != null) ? data : new JSONArray();
	}
	
	public JSONArray toJson() {
		return data;
	}

	@Override
	public String toString() {
		return toJson().toString();
	}
	
}
