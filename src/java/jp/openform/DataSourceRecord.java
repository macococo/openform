package jp.openform;

import org.json.JSONArray;


public class DataSourceRecord extends JsonArrayWrapper {
	
	private DataSource dataSource;
	
	public DataSourceRecord(final DataSource dataSource) {
		this(dataSource, null);
	}
	
	public DataSourceRecord(final DataSource dataSource, final JSONArray data) {
		super(data);
		this.dataSource = dataSource;
	}
	
	public DataSource getDataSource() {
		return dataSource;
	}
	
	public Object getValue(final String name) {
		final int index = dataSource.getFields().getFieldIndex(name);
		return (index >= 0) ? JsonUtil.getArray(data, index) : null;
	}
	
	public DataSourceRecord setValue(final String name, final Object value) {
		final int index = dataSource.getFields().getFieldIndex(name);
		if (index >= 0) {
			JsonUtil.putArray(data, index, value);
		}
		return this;
	}
	
}
