package jp.openform;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.json.JSONArray;

public class DataSourceFields extends JsonArrayWrapper implements Iterable<DataSourceField> {
	
	public DataSourceFields() {
		this(null);
	}

	public DataSourceFields(final JSONArray data) {
		super(data);
	}

	@Override
	public Iterator<DataSourceField> iterator() {
		final List<DataSourceField> list = new ArrayList<DataSourceField>(data.length());
		for (int i = 0; i < data.length(); i++) {
			list.add(new DataSourceField(JsonUtil.getJsonObjectByArray(data, i)));
		}
		return list.iterator();
	}
	
	public DataSourceFields addField(final DataSourceField field) {
		data.put(field.toJson());
		return this;
	}
	
	public int getFieldIndex(final String name) {
		for (int i = 0; i < data.length(); i++) {
			final DataSourceField field = new DataSourceField(JsonUtil.getJsonObjectByArray(data, i));
			if (field.getName().equals(name)) {
				return i;
			}
		}
		return -1;
	}
	
	public DataSourceField getField(final String name) {
		final int index = getFieldIndex(name);
		if (index >= 0) {
			return new DataSourceField(JsonUtil.getJsonObjectByArray(data, index));
		}
		return null;
	}
	
}
